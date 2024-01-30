package models

import (
	"csat/logger"
	"csat/schema"
	"csat/utils"
	"fmt"
	"time"
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
