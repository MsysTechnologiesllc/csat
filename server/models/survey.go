package models

import (
	"csat/logger"
	"csat/schema"
	"csat/utils"
	"encoding/json"
	"fmt"
	"math"
	"os"
	"sort"

	"github.com/lib/pq"
)

type Survey struct {
	schema.Survey
}

type SurveyAnswers struct {
	schema.SurveyAnswers
}

type UserFeedback struct {
	schema.UserFeedback
}

type SurveyDetails struct {
	Survey        schema.Survey
	SurveyFormat  schema.SurveyFormat
	AverageRating float64
}

type UpdateAnswerRequest struct {
	Survey schema.Survey
}

// @Summary Get Survey Details
// @Description Retrieve survey details based on Survey ID
// @Tags Survey
// @Accept json
// @Produce json
// @Param id query int true "Survey ID (required)" default(2)
// @Success 200 {object} map[string]interface{} "Survey details retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/survey-details [get]
func GetSurvey(id uint) (*SurveyDetails, error) {
	var surveyDetails SurveyDetails

	if err := GetDB().Preload("UserFeedback").Preload("UserFeedback.User").Preload("SurveyAnswers").Preload("SurveyAnswers.McqQuestions").Preload("Project").Where("ID = ?", id).Not("surveys.status = ?", "template").Find(&surveyDetails.Survey).Error; err != nil {
		logger.Log.Println("Error fetching survey details:", err)
		return nil, err
	}
	surveyFormatID := surveyDetails.Survey.SurveyFormatID
	if err := GetDB().Where("ID = ?", surveyFormatID).First(&surveyDetails.SurveyFormat).Error; err != nil {
		logger.Log.Println("Error fetching survey format details:", err)
		return nil, err
	}

	var totalRatings, totalOptionsLength float64
	for _, answer := range surveyDetails.Survey.SurveyAnswers {
		if answer.McqQuestions.Type == "star-rating" || answer.McqQuestions.Type == "scale-rating" {
			if answer.McqQuestions.Options == "" || answer.Answer == nil {
				logger.Log.Println("Warning: Options or Answer is nil for question ID:", answer.McqQuestions.ID)
				continue
			}
			var options, answerData []map[string]interface{}
			if err := json.Unmarshal([]byte(answer.McqQuestions.Options), &options); err != nil {
				logger.Log.Println("Error decoding question options:", err)
				continue
			}
			if err := json.Unmarshal([]byte(answer.Answer[0]), &answerData); err != nil {
				logger.Log.Println("Error decoding survey answer:", err)
				continue
			}
			ratingPercent := (float64(len(answerData)) / float64(len(options))) * 100
			totalRatings += (ratingPercent / 100) * 5
			totalOptionsLength++
		}
	}

	var finalRating float64
	if totalOptionsLength > 0 {
		finalRating = totalRatings / totalOptionsLength
		finalRating = math.Round(finalRating*100) / 100
	}

	surveyDetails.AverageRating = finalRating
	return &surveyDetails, nil
}

// @Summary Create Survey
// @Description Create Survey
// @Tags Survey
// @Accept json
// @Produce json
// @Param request body Survey false "Create Survey Request"
// @Success 200 {object} map[string]interface{} "Survey Createed Successfully" example:"{'message': 'Survey Createed Successfully'}"
// @Failure 400 {object} map[string]interface{} "Invalid request" example:"{'error': 'Invalid request'}"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid" example:"{'error': 'Unauthorized'}"
// @Failure 500 {object} map[string]interface{} "Internal server error" example:"{'error': 'Internal server error'}"
// @Router /api/survey [post]
func CreateSurvey(survey *schema.Survey) (uint, error) {
	err := GetDB().Create(survey).Error
	if err != nil {
		return 0, err
	}
	return survey.ID, nil
}

func SurveyAnswersCreate(surveyAnswers *schema.SurveyAnswers) (*schema.SurveyAnswers, error) {
	err := GetDB().Create(surveyAnswers).Error
	if err != nil {
		return nil, err
	}
	return surveyAnswers, nil
}

func UserFeedbackCreate(userFeedback *schema.UserFeedback) (*schema.UserFeedback, error) {
	err := GetDB().Create(userFeedback).Error
	if err != nil {
		return nil, err
	}
	return userFeedback, nil
}

// @Summary Get Survey format
// @Description Retrieve survey format based on ID
// @Tags Survey
// @Accept json
// @Produce json
// @Param surveyFormatID query int false "Survey Format ID (optional)" default(56)
// @Param project_id query int false "Project ID (optional)" default(1)
// @Success 200 {object} map[string]interface{} "Survey format retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/survey-format [get]
func GetSurveyFormatFromDB(id uint, projectID uint) (*SurveyDetails, error) {
	var surveyDetails SurveyDetails

	if err := GetDB().Preload("UserFeedback").
		Preload("UserFeedback.User").
		Preload("SurveyAnswers").
		Preload("SurveyAnswers.McqQuestions").
		Preload("Project").
		Where("survey_format_id = ? OR project_id = ?", id, projectID).
		Order("created_at ASC"). // Order by creation time in ascending order
		First(&surveyDetails.Survey).
		Error; err != nil {

		logger.Log.Println("Error fetching survey details:", err)
		return nil, err
	}

	surveyFormatID := surveyDetails.Survey.SurveyFormatID
	if err := GetDB().Where("ID = ?", surveyFormatID).First(&surveyDetails.SurveyFormat).Error; err != nil {
		logger.Log.Println("Error fetching survey format details:", err)
		return nil, err
	}

	return &surveyDetails, nil
}

// @Summary Create Survey
// @Description Create Survey
// @Tags Survey
// @Accept json
// @Produce json
// @Param request body UpdateAnswerRequest false "Create Survey Request"
// @Success 200 {object} map[string]interface{} "Survey Createed Successfully" example:"{'message': 'Survey Createed Successfully'}"
// @Failure 400 {object} map[string]interface{} "Invalid request" example:"{'error': 'Invalid request'}"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid" example:"{'error': 'Unauthorized'}"
// @Failure 500 {object} map[string]interface{} "Internal server error" example:"{'error': 'Internal server error'}"
// @Router /api/survey-answers [put]
func BulkUpdateSurveyAnswers(requestData map[string]interface{}) ([]SurveyAnswers, error) {
	var updatedSurveyAnswers []SurveyAnswers

	db := GetDB()

	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	for _, data := range requestData["survey_answers"].([]map[string]interface{}) {
		// Perform validation if needed

		// Extract data
		answer, ok := data["answer"]
		if !ok {
			return nil, fmt.Errorf("missing 'answer' field")
		}
		comment, ok := data["comment"].(string)
		if !ok {
			comment = ""
		}

		// Check if the answer is a number, string, or an array
		switch answer := answer.(type) {
		case float64, int, int64:
			// Convert the number to a string
			data["answer"] = fmt.Sprintf("%v", answer)
		case string:
			// Answer is already a string, no conversion needed
			data["answer"] = fmt.Sprintf("\"%v\"", answer)
		case []interface{}:
			// Convert the array to a JSON string
			answerJSON, err := json.Marshal(answer)
			if err != nil {
				tx.Rollback()
				fmt.Println(err)
				return nil, err
			}
			data["answer"] = string(answerJSON)
		default:
			// Handle other cases, such as a string
			data["answer"] = fmt.Sprintf("%v", answer)
		}

		// Convert the answer to a pq.StringArray
		answerArray := pq.StringArray{fmt.Sprintf("%v", data["answer"])}

		// Update the survey answer
		var surveyAnswer SurveyAnswers
		if err := tx.Model(&surveyAnswer).Where("ID = ?", data["ID"]).Updates(map[string]interface{}{"answer": answerArray, "comment": comment}).Scan(&surveyAnswer).Error; err != nil {
			tx.Rollback()
			fmt.Println(err)
			return nil, err
		}

		updatedSurveyAnswers = append(updatedSurveyAnswers, surveyAnswer)
	}
	surveyID, ok := requestData["survey_id"].(uint)
	if ok {
		projectID, ok := requestData["project_id"].(uint)
		surveyStatus, ok := requestData["survey_status"].(string)
		if !ok {
			return nil, fmt.Errorf("invalid 'survey_status' format")
		}

		if err := tx.Model(&Survey{}).Where("ID = ?", surveyID).Update("status", surveyStatus).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
		if surveyStatus == "publish" {
			linkURL := os.Getenv("SURVEY_COMPLETED_BASE_URL")
			users, err := GetUsersListByProjectID(projectID)
			if err != nil {
				return nil, fmt.Errorf("invalid 'survey_status' format")
			}

			for _, user := range users {
				// Check if user role is not "user" and not "client"
				if user.Role != "user" && user.Role != "client" {
					surveyIDString := fmt.Sprintf("%d", surveyID)
					emailData := utils.EmailData{
						Name:        user.Name,
						ProjectName: "Completed survey",
						SurveyID:    linkURL + surveyIDString,
					}
					emailRecipient := utils.EmailRecipient{
						To:      []string{user.Email},
						Subject: "Survey Completed Mail",
					}

					templateName := "email_template"

					// Send mail using the populated emailData and emailRecipient
					if err := utils.SendMail(templateName, emailData, emailRecipient); err != nil {
						tx.Rollback()
						return nil, fmt.Errorf("Failed to send email for user with ID %d: %v", user.ID, err)
					}
				}
			}
		}
	}

	tx.Commit()

	return updatedSurveyAnswers, nil
}

func (surveyDetails *SurveyDetails) GetAllQuestionAndUserIDs() (questionIDs, userIDs []uint) {
	// Iterate through UserFeedbacks
	for _, feedback := range surveyDetails.Survey.UserFeedback {
		userIDs = append(userIDs, feedback.User.ID)
	}

	// Iterate through SurveyAnswers
	for _, answer := range surveyDetails.Survey.SurveyAnswers {
		questionIDs = append(questionIDs, answer.McqQuestions.ID)
	}

	return questionIDs, userIDs
}

func GetUserByEmail(email string) (*schema.User, error) {
	var user schema.User
	if err := GetDB().Preload("Projects").Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func SendSurveyMail(userDetails *schema.User, surveyID uint) error {
	surveyIDString := fmt.Sprintf("%d", surveyID)
	emailData := utils.EmailData{
		Name:     userDetails.Name,
		SurveyID: os.Getenv("EMAIL_BASE_URL") + surveyIDString,
	}
	emailRecipient := utils.EmailRecipient{
		To:      []string{userDetails.Email},
		Subject: "Survey Mail",
	}
	templateName := "email_template"

	return utils.SendMail(templateName, emailData, emailRecipient)
}

func CreateAndStoreUserFeedback(userIDs []uint, surveyID uint) ([]*schema.UserFeedback, error) {
	var userFeedbacksData []*schema.UserFeedback

	for _, userID := range userIDs {
		userFeedback := &schema.UserFeedback{
			UserID:   userID,
			SurveyID: surveyID,
		}
		userFeedbacks, err := UserFeedbackCreate(userFeedback)
		if err != nil {
			return nil, err
		}
		userFeedbacksData = append(userFeedbacksData, userFeedbacks)
	}

	return userFeedbacksData, nil
}

func CreateAndStoreSurveyAnswers(questionIDs []uint, surveyID uint) ([]*schema.SurveyAnswers, error) {
	var surveyAnswersData []*schema.SurveyAnswers

	sort.Slice(questionIDs, func(i, j int) bool { return questionIDs[i] < questionIDs[j] })
	for _, questionID := range questionIDs {
		surveyAnswer := &schema.SurveyAnswers{
			QuestionID: questionID,
			SurveyID:   surveyID,
		}
		surveyAnswers, err := SurveyAnswersCreate(surveyAnswer)
		if err != nil {
			return nil, err
		}
		surveyAnswersData = append(surveyAnswersData, surveyAnswers)
	}

	return surveyAnswersData, nil
}

func GetSurveyFormatListFromDB(projectID uint) (*[]schema.SurveyFormat, error) {
	var surveyFormats []schema.SurveyFormat

	if err := GetDB().Preload("Surveys", "Status = ?", "template").Preload("Surveys.UserFeedback").
		Preload("Surveys.UserFeedback.User").
		Preload("Surveys.SurveyAnswers").
		Preload("Surveys.SurveyAnswers.McqQuestions").
		Preload("McqQuestions").
		Where("project_id = ?", projectID).Find(&surveyFormats).Error; err != nil {
		logger.Log.Println("Error fetching survey format list:", err)
		return nil, err
	}

	return &surveyFormats, nil
}

func GetSurveyForClient(id uint) (*SurveyDetails, error) {
	var surveyDetails SurveyDetails

	if err := GetDB().Where("ID = ?", id).Find(&surveyDetails.Survey).Error; err != nil {
		logger.Log.Println("Error fetching survey details:", err)
		return nil, err
	}
	surveyFormatID := surveyDetails.Survey.SurveyFormatID
	if err := GetDB().Where("ID = ?", surveyFormatID).First(&surveyDetails.SurveyFormat).Error; err != nil {
		logger.Log.Println("Error fetching survey format details:", err)
		return nil, err
	}
	return &surveyDetails, nil
}
