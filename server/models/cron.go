package models

import (
	"csat/logger"
	"csat/schema"
	"csat/utils"
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
	cron "github.com/robfig/cron/v3"
)

func CronJob() {
	logger.Log.Println("Cron job is running at:", time.Now())
	db := GetDB()

	var survey []schema.Survey
	db.Find(&survey)

	for _, survey := range survey {
		if isTimeToRunTask(survey.CreatedAt, int(survey.SurveyFrequencyDays)) {
			logger.Log.Printf("Running code for SurveyFormat ID %d\n", survey.ID)
			users, err := GetUsersByProjectID(survey.ProjectID)
			if err != nil {
				logger.Log.Println("Error fetching users:", err)
				return
			}
			mcqQuestions, err := GetMcqQuestionsBySurveyFormatID(survey.SurveyFormatID)
			if err != nil {
				logger.Log.Println("Error fetching multiple-choice questions:", err)
				return
			}
			surveyFormat, err := GetSurveyFormatByID(survey.SurveyFormatID)
			if err != nil {
				logger.Log.Println("Error fetching SUrvey format:", err)
				return
			}
			for _, user := range users {
				if user.Role == "client" {
					_, _, surveyId, err := CreateSurveyWithUserFeedback(db, surveyFormat, users, mcqQuestions)
					if err != nil {
						logger.Log.Println("Error Creating survey and user feedbacks:", err)
						return
					}

					emailData := utils.EmailData{
						Name:        user.Name,
						ProjectName: user.Projects[0].Name,
						SurveyID:    fmt.Sprintf("http://test.com/csat?surveyid=%d", surveyId),
					}
					emailRecipient := utils.EmailRecipient{
						To:      []string{user.Email},
						Subject: "Survey Mail",
					}

					templateName := "email_template"

					err = utils.SendMail(templateName, emailData, emailRecipient)
					if err != nil {
						logger.Log.Printf("Failed to send email for user with ID %d: %v\n", user.ID, err)
					}
				}
			}
		}
	}
}

func isTimeToRunTask(createdAt time.Time, frequencyDays int) bool {
	elapsedDays := int(time.Since(createdAt).Round(time.Hour*24).Hours() / 24)
	return elapsedDays%frequencyDays == 0
}

func GetMcqQuestionsBySurveyFormatID(surveyFormatID uint) ([]schema.McqQuestions, error) {
	var mcqQuestions []schema.McqQuestions
	if err := db.Where("survey_format_id = ?", surveyFormatID).Find(&mcqQuestions).Error; err != nil {
		return nil, err
	}
	return mcqQuestions, nil
}

func GetSurveyFormatByID(surveyFormatID uint) (schema.SurveyFormat, error) {
	var surveyFormat schema.SurveyFormat
	if err := db.Where("ID = ?", surveyFormatID).First(&surveyFormat).Error; err != nil {
		return schema.SurveyFormat{}, err
	}
	return surveyFormat, nil
}

func UpdateSurveyDates(db *gorm.DB, surveyID uint, updatedDates, removedDates []string) error {
	survey := &Survey{}
	if err := db.First(&survey, surveyID).Error; err != nil {
		return err
	}
	survey.CompletedDates = append(survey.CompletedDates, removedDates...)
	return db.Transaction(func(tx *gorm.DB) error {
		return tx.Model(&Survey{}).Where("id = ?", surveyID).Updates(map[string]interface{}{
			"survey_dates":    updatedDates,
			"completed_dates": survey.CompletedDates,
		}).Error
	})
}

func CheckAndCreateSurveys(db *gorm.DB) (uint, error) {
	var surveys []schema.Survey
	var surveyID uint
	if err := db.Where("survey_dates IS NOT NULL").Find(&surveys).Error; err != nil {
		return 0, err
	}
	for _, survey := range surveys {
		var updatedSurveyDates []string
		var removedSurveyDates []string
		for _, surveyDateStr := range survey.SurveyDates {
			surveyDate, err := time.Parse("2006-01-02 15:04:05.999999-07:00", surveyDateStr)
			if err != nil {
				logger.Log.Println("Error parsing survey date:", err)
				continue
			}
			if surveyDate.After(time.Now().Add(-1*time.Minute)) && surveyDate.Before(time.Now().Add(1*time.Minute)) {
				logger.Log.Println("second cron condition done")
				newSurvey := schema.Survey{
					Name:                survey.Name,
					Description:         survey.Description,
					Status:              survey.Status,
					ProjectID:           survey.ProjectID,
					SurveyFormatID:      survey.SurveyFormatID,
					SurveyFrequencyDays: survey.SurveyFrequencyDays,
					DeadLine:            survey.DeadLine,
					CustomerEmail:       survey.CustomerEmail,
				}
				newSurveyID, err := CreateSurvey(&newSurvey)
				if err != nil {
					logger.Log.Println("Error creating new survey:", err)
					continue
				}
				userDetails, err := GetUserByEmail(survey.CustomerEmail)
				if err != nil {
					logger.Log.Println("Failed to Fetch user details", err)
				}
				if err := SendSurveyMail(userDetails, surveyID); err != nil {
					logger.Log.Printf("Failed to send email for user with ID %d: %v\n", userDetails.ID, err)
				}
				surveyID = newSurveyID
				removedSurveyDates = append(removedSurveyDates, surveyDateStr)
			} else {
				updatedSurveyDates = append(updatedSurveyDates, surveyDateStr)
			}
		}
		survey.SurveyDates = updatedSurveyDates
		err := UpdateSurveyDates(db, survey.ID, updatedSurveyDates, removedSurveyDates)
		if err != nil {
			logger.Log.Println("Error updating survey dates in the database:", err)
		}
	}
	return surveyID, nil
}

func SurveyCronJob(cronJob *cron.Cron) {
	logger.Log.Println("Cron job is running at:", time.Now())
	db := GetDB()

	var survey []schema.Survey
	db.Where("survey_dates IS NOT NULL").Find(&survey)
	for _, survey := range survey {

		// var updatedSurveyDates []string
		// var removedSurveyDates []string
		for _, surveyDateStr := range survey.SurveyDates {
			surveyDate, err := time.Parse("2006-01-02 15:04:05.999999-07:00", surveyDateStr)
			if err != nil {
				logger.Log.Println("Error parsing survey date:", err)
				continue
			}
			if surveyDate.After(time.Now().Add(-30*time.Minute)) && surveyDate.Before(time.Now().Add(30*time.Minute)) {
				cronExpr := fmt.Sprintf("%d %d %d %d *", surveyDate.Minute(), surveyDate.Hour(), surveyDate.Day(), int(surveyDate.Month()))
				fmt.Println(cronExpr)
				cronJob.AddFunc(cronExpr, func() {
					logger.Log.Println("Running task for survey date:", surveyDate)
					_, err := CheckAndCreateSurveys(db)
					if err != nil {
						logger.Log.Println("Error parsing survey date:", err)
					}
				})
				// removedSurveyDates = append(removedSurveyDates, surveyDateStr)
			}
		}
	}
}
