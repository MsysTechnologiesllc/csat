package controllers

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/models"
	"csat/schema"
	u "csat/utils"
	"encoding/json"
	"net/http"
	"strconv"
)

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
var GetSurveyDetails = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	// Parse query parameters
	queryValues := r.URL.Query()
	id := queryValues.Get(constants.ID)
	data := models.GetSurvey(id)
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}

// Struct for survey API request body sample
type CreateSurveyRequest struct {
	schema.Survey
}

// @Summary Create Survey
// @Description Create Survey
// @Tags Survey
// @Accept json
// @Produce json
// @Param request body CreateSurveyRequest false "Create Survey Request"
// @Success 200 {object} map[string]interface{} "Survey Createed Successfully" example:"{'message': 'Survey Createed Successfully'}"
// @Failure 400 {object} map[string]interface{} "Invalid request" example:"{'error': 'Invalid request'}"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid" example:"{'error': 'Unauthorized'}"
// @Failure 500 {object} map[string]interface{} "Internal server error" example:"{'error': 'Internal server error'}"
// @Router /api/survey [post]
var CreateSurvey = func(w http.ResponseWriter, r *http.Request) {
	var data map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Extract survey data
	name := data["name"].(string)
	description := data["description"].(string)
	status := data["status"].(string)

	survey := schema.Survey{
		Name:        name,
		Description: description,
		Status:      status,
	}

	surveyID, err := models.CreateSurvey(&survey)

	var userFeedbacksData []*schema.UserFeedback
	var surveyQuestionsData []*schema.SurveyAnswers

	if err != nil {
		http.Error(w, "Failed to store survey in the database", http.StatusInternalServerError)
		return
	}

	// Extract user IDs
	userIDs, ok := data["userId"].([]interface{})
	if !ok {
		http.Error(w, "Invalid or missing 'userId' field", http.StatusBadRequest)
		return
	}
	for _, userID := range userIDs {
		userIDValue, ok := userID.(map[string]interface{})["id"].(float64)
		if !ok {
			http.Error(w, "Invalid or missing 'id' field within a userId", http.StatusBadRequest)
			return
		}

		// Create user feedback
		userFeedback := &schema.UserFeedback{
			UserID:   uint(userIDValue),
			SurveyID: surveyID,
		}
		userFeedbacks, err := models.UserFeedbackCreate(userFeedback)
		if err != nil {
			http.Error(w, "Failed to store survey in the database", http.StatusInternalServerError)
			return
		}
		userFeedbacksData = append(userFeedbacksData, userFeedbacks)
	}

	// Extract questions
	questionIDs, ok := data["questions"].([]interface{})
	if !ok {
		http.Error(w, "Invalid or missing 'questions' field", http.StatusBadRequest)
		return
	}
	for _, questionID := range questionIDs {
		questionIDValue, ok := questionID.(map[string]interface{})["id"].(float64)
		if !ok {
			http.Error(w, "Invalid or missing 'id' field within a questionId", http.StatusBadRequest)
			return
		}

		// Create questions
		surveyQuestion := &schema.SurveyAnswers{
			QuestionID: uint(questionIDValue),
			SurveyID:   surveyID,
		}
		surveyQuestions, err := models.SurveyAnswersCreate(surveyQuestion)
		if err != nil {
			http.Error(w, "Failed to store survey in the database", http.StatusInternalServerError)
			return
		}
		surveyQuestionsData = append(surveyQuestionsData, surveyQuestions)
	}
	resp := u.Message(true, constants.SUCCESS)

	resp["SurveyID"] = surveyID
	resp["userFeedback"] = userFeedbacksData
	resp["surveyQuestions"] = surveyQuestionsData

	u.Respond(w, resp)
}

var GetSurveyFormatByID = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	surveyFormatIDStr := r.URL.Query().Get("surveyFormatID")
    surveyFormatID, err := strconv.ParseUint(surveyFormatIDStr, 10, 64)
    if err != nil {
        http.Error(w, "Invalid surveyFormatID", http.StatusBadRequest)
        return
    }
	data, _ := models.GetSurveyFormatFromDB(uint(surveyFormatID))
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}
