package controllers

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/models"
	"csat/schema"
	u "csat/utils"
	"encoding/json"
	"fmt"
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
	data, _ := models.GetSurvey(id)
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}

// Struct for survey API request body sample
type CreateSurveyRequest struct {
	schema.Survey
}
type UpdateAnswerRequest struct {
	schema.SurveyAnswers
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
func BulkUpdateSurveyAnswers(w http.ResponseWriter, r *http.Request) {
	var requestData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		fmt.Println("Error decoding request body:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	surveyStatus, ok := requestData["survey_status"].(string)
	if !ok {
		http.Error(w, "Invalid 'survey_status' format", http.StatusBadRequest)
		return
	}
	surveyId, ok := requestData["survey_id"].(float64)
	if !ok {
		http.Error(w, "Invalid 'survey_id' format", http.StatusBadRequest)
		return
	}
	surveyID := uint(surveyId)

	answersInterface, ok := requestData["survey_answers"].([]interface{})
	if !ok {
		http.Error(w, "Invalid 'survey_answers' format", http.StatusBadRequest)
		return
	}

	var surveyAnswers []map[string]interface{}
	for _, ans := range answersInterface {
		answerMap, ok := ans.(map[string]interface{})
		if !ok {
			http.Error(w, "Invalid 'answer' format", http.StatusBadRequest)
			return
		}
		surveyAnswers = append(surveyAnswers, answerMap)
	}

	// Prepare the updated request data
	updatedRequestData := map[string]interface{}{
		"survey_status":  surveyStatus,
		"survey_answers": surveyAnswers,
		"survey_id":      surveyID,
	}

	// Call the model function for bulk update
	updatedSurveyAnswers, err := models.BulkUpdateSurveyAnswers(updatedRequestData)
	if err != nil {
		http.Error(w, "Failed to update survey answers", http.StatusInternalServerError)
		return
	}

	// Respond with the updated survey answers
	response := u.Message(true, "Bulk update successful")
	response["data"] = updatedSurveyAnswers
	u.Respond(w, response)
}
