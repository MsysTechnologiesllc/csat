package models

import (
	"csat/logger"
	"csat/schema"
	"encoding/json"
	"fmt"

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
	Survey       schema.Survey
	SurveyFormat schema.SurveyFormat
}

// @Summary Get Survey Details
// @Description Retrieve survey details based on Survey ID
// @Tags survey
// @Accept json
// @Produce json
// @Param id query int true "Survey ID (required)" default(2)
// @Success 200 {object} map[string]interface{} "Survey details retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/survey-details [get]
func GetSurvey(id string) (*SurveyDetails, error) {
	var surveyDetails SurveyDetails

	if err := GetDB().Preload("UserFeedback").Preload("UserFeedback.User").Preload("SurveyAnswers").Preload("SurveyAnswers.McqQuestions").Preload("Project").Where("ID = ?", id).Find(&surveyDetails.Survey).Error; err != nil {
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
// @Tags survey
// @Accept json
// @Produce json
// @Param surveyFormatID query int true "survey Format ID (required)" default(2)
// @Success 200 {object} map[string]interface{} "Survey format retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/survey-format [get]
func GetSurveyFormatFromDB(id uint) (*schema.SurveyFormat, error) {
	var surveyFormat schema.SurveyFormat

	if err := GetDB().Where("id = ?", id).Preload("Surveys.UserFeedback").Preload("Surveys.SurveyAnswers").Preload("Surveys.Project").Preload("McqQuestions").First(&surveyFormat).Error; err != nil {
		logger.Log.Println("Error", err)
		return nil, err
	}

	return &surveyFormat, nil
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
func BulkUpdateSurveyAnswers(requestData []map[string]interface{}) ([]SurveyAnswers, error) {
    var updatedSurveyAnswers []SurveyAnswers

    db := GetDB()

    tx := db.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
        }
    }()

    for _, data := range requestData {
        // Perform validation if needed

        // Extract data
        answers, ok := data["answer"].([]interface{})
        if !ok {
            return nil, fmt.Errorf("invalid 'answer' format")
        }

        // Convert the answer slice to a pq.StringArray
        answerArray := make(pq.StringArray, len(answers))
        for i, ans := range answers {
            ansMap, ok := ans.(map[string]interface{})
            if !ok {
                return nil, fmt.Errorf("invalid 'answer' format")
            }

            // Convert each map to a JSON string
            ansJSON, err := json.Marshal(ansMap)
            if err != nil {
                return nil, err
            }

            answerArray[i] = string(ansJSON)
        }

        // Update the survey answer
        var surveyAnswer SurveyAnswers
        if err := tx.Model(&surveyAnswer).Where("id = ?", data["ID"]).Updates(map[string]interface{}{"answer": answerArray}).Scan(&surveyAnswer).Error; err != nil {
            tx.Rollback()
            return nil, err
        }

        updatedSurveyAnswers = append(updatedSurveyAnswers, surveyAnswer)
    }

    tx.Commit()

    return updatedSurveyAnswers, nil
}
