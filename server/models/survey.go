package models

import (
	"csat/logger"
	"csat/schema"
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
func GetSurvey(id string) []*schema.Survey {
	var survey []*schema.Survey

	if err := GetDB().Preload("UserFeedback").Preload("UserFeedback.User").Preload("SurveyAnswers").Preload("SurveyAnswers.McqQuestions").Where("ID = ?", id).Find(&survey).Error; err != nil {
		logger.Log.Println("Error", err)
		return nil
	}

	return survey
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

func GetSurveyFormatFromDB(id uint) (*schema.SurveyFormat, error) {
	var surveyFormat schema.SurveyFormat

	if err := GetDB().Where("id = ?", id).Preload("Surveys.UserFeedback").Preload("Surveys.SurveyAnswers").Preload("Surveys.Project").Preload("McqQuestions").First(&surveyFormat).Error; err != nil {
		logger.Log.Println("Error", err)
		return nil, err
	}

	return &surveyFormat, nil
}
