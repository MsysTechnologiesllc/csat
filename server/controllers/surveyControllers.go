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
	"time"
)

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
var GetSurveyDetails = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	// Parse query parameters
	queryValues := r.URL.Query()
	idStr := queryValues.Get(constants.ID)
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid 'id' format", http.StatusBadRequest)
		return
	}
	data, _ := models.GetSurvey(uint(id))
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
	projectIDStr := data["project_id"].(float64)
	surveyFormatIDStr := data["survey_format_id"].(float64)
	frequescyDayStr := data["survey_frequency_days"].(float64)

	projectID := uint(projectIDStr)
	surveyFormatID := uint(surveyFormatIDStr)
	frequescyDays := uint(frequescyDayStr)

	currentDate := time.Now()
	deadline := currentDate.Add(time.Duration(constants.SURVEY_DEADLINE) * 24 * time.Hour)

	survey := schema.Survey{
		Name:                name,
		Description:         description,
		Status:              status,
		ProjectID:           projectID,
		SurveyFormatID:      surveyFormatID,
		SurveyFrequencyDays: frequescyDays,
		DeadLine:            deadline,
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
var GetSurveyFormatByID = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	surveyFormatIDStr := r.URL.Query().Get("surveyFormatID")
	projectIDStr := r.URL.Query().Get("project_id")

	if surveyFormatIDStr != "" {
		// If surveyFormatID is provided, get survey format by ID
		surveyFormatID, err := strconv.ParseUint(surveyFormatIDStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid surveyFormatID", http.StatusBadRequest)
			return
		}
		data, _ := models.GetSurveyFormatFromDB(uint(surveyFormatID), 0) // 0 as projectID
		resp := u.Message(true, constants.SUCCESS)
		resp[constants.DATA] = data
		u.Respond(w, resp)
	} else if projectIDStr != "" {
		// If projectID is provided, get survey format by projectID
		projectID, err := strconv.ParseUint(projectIDStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid Project ID", http.StatusBadRequest)
			return
		}
		data, _ := models.GetSurveyFormatFromDB(0, uint(projectID)) // 0 as surveyFormatID
		resp := u.Message(true, constants.SUCCESS)
		resp[constants.DATA] = data
		u.Respond(w, resp)
	} else {
		http.Error(w, "Either surveyFormatID or projectID must be provided", http.StatusBadRequest)
		return
	}
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
	projectId, ok := requestData["project_id"].(float64)
	if !ok {
		http.Error(w, "Invalid 'survey_id' format", http.StatusBadRequest)
		return
	}
	projectID := uint(projectId)

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
		"project_id":     projectID,
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

func CloneSurvey(w http.ResponseWriter, r *http.Request) {
	var requestData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	surveyId, ok1 := requestData["survey_id"].(float64)
	surveyDates, ok2 := requestData["survey_dates"].([]interface{})
	clientEmailStrngs, ok3 := requestData["client_emails"].([]interface{})

	if !ok1 || !ok2 || !ok3 || len(clientEmailStrngs) == 0 {
		http.Error(w, "Invalid request parameters", http.StatusBadRequest)
		return
	}
	var clientEmails []string
	for _, clientEmailInterface := range clientEmailStrngs {
		email, ok := clientEmailInterface.(string)
		if !ok {
			http.Error(w, "Invalid client email", http.StatusBadRequest)
			return
		}
		clientEmails = append(clientEmails, email)
	}
	var surveyDatesStr []string
	for _, date := range surveyDates {
		surveyDatesStr = append(surveyDatesStr, date.(string))
	}
	existingSurvey, err := models.GetSurvey(uint(surveyId))
	if err != nil {
		http.Error(w, "Failed to get existing survey details", http.StatusInternalServerError)
		return
	}
	var surveyIDs []uint
	for _, clientEmailStr := range clientEmails {
		userDetails, err := models.GetUserByEmail(clientEmailStr)
		if err != nil {
			http.Error(w, "Failed to get user details", http.StatusBadRequest)
			return
		}

		deadline := time.Now().Add(time.Duration(constants.SURVEY_DEADLINE) * 24 * time.Hour)
		survey := schema.Survey{
			Name:           existingSurvey.Survey.Name,
			Description:    existingSurvey.Survey.Description,
			Status:         "pending",
			ProjectID:      existingSurvey.Survey.ProjectID,
			SurveyFormatID: existingSurvey.Survey.SurveyFormatID,
			DeadLine:       deadline,
			SurveyDates:    surveyDatesStr,
			CustomerEmail:  clientEmailStr,
		}

		newSurveyID, err := models.CreateSurvey(&survey)
		if err != nil {
			http.Error(w, "Failed to store survey in the database", http.StatusInternalServerError)
			return
		}
		surveyIDs = append(surveyIDs, newSurveyID)

		questionIDs, userIDs := existingSurvey.GetAllQuestionAndUserIDs()
		fmt.Println(questionIDs)

		_, err = models.CreateAndStoreUserFeedback(userIDs, newSurveyID)
		if err != nil {
			http.Error(w, "Failed to store User feedback in the database", http.StatusInternalServerError)
			return
		}

		_, err = models.CreateAndStoreSurveyAnswers(questionIDs, newSurveyID)
		if err != nil {
			http.Error(w, "Failed to store survey answers in the database", http.StatusInternalServerError)
			return
		}

		if err := models.SendSurveyMail(userDetails, newSurveyID); err != nil {
			logger.Log.Printf("Failed to send email for user with ID %d: %v\n", userDetails.ID, err)
		}
	}
	resp := u.Message(true, constants.SUCCESS)
	resp["SurveyIDs"] = surveyIDs
	u.Respond(w, resp)
}

var GetSurveyFormatList = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	projectIDStr := r.URL.Query().Get("project_id")
	if projectIDStr == "" {
		http.Error(w, "Project ID is required", http.StatusBadRequest)
		return
	}
	projectID, err := strconv.ParseUint(projectIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid Project ID", http.StatusBadRequest)
		return
	}

	data, _ := models.GetSurveyFormatListFromDB(uint(projectID))
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}
