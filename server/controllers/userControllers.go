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

// @Summary Get user list
// @Description Retrieve a list of users based on name and project ID
// @Tags Users
// @Accept json
// @Produce json
// @Param name query string false "User name (optional)"
// @Param project_id query int true "Project ID (required)" default(301)
// @Success 200 {object} map[string]interface{} "User list retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 404 {object} map[string]interface{} "No users found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/team-list [get]
var GetUserList = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	// Parse query parameters
	queryValues := r.URL.Query()
	name := queryValues.Get(constants.NAME)
	projectID := queryValues.Get(constants.PROJECT_ID)

	data := models.GetUsersList(name, projectID)
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}

// @Summary Get user Details
// @Description Retrieve user details based on User ID
// @Tags Users
// @Accept json
// @Produce json
// @Param user_id query int true "User ID (required)" default(2)
// @Success 200 {object} map[string]interface{} "User details retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/user [get]
var GetUserDetails = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Get User Datails - Controller")

	// Parse query parameters
	user_id := r.URL.Query().Get(constants.USER_ID)
	userID64, err := strconv.ParseUint(user_id, 10, 32)
	userID := uint(userID64)
	if err != nil {
		u.Respond(w, u.Message(false, constants.INVALID_USERID))
		return
	}

	data := models.GetUserDetailsByID(userID)
	if data["status"] == false {
		errorMessage := u.Message(false, data["message"].(string))
		u.Respond(w, errorMessage)
		return
	}
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}

// Struct for userFeedback API request body sample
type UpdateUserRequest struct {
	UserFeedbackId int     `json:"userFeedbackId"`
	Positives      string  `json:"positives"`
	Negatives      string  `json:"negatives"`
	Rating         float64 `json:"rating"`
}

// @Summary Update user feedback
// @Description Update user feedback details
// @Tags Users
// @Accept json
// @Produce json
// @Param request body UpdateUserRequest false "Update User Feedback Request"
// @Success 200 {object} map[string]interface{} "User feedback updated successfully" example:"{'message': 'Feedback updated successfully'}"
// @Failure 400 {object} map[string]interface{} "Invalid request" example:"{'error': 'Invalid request'}"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid" example:"{'error': 'Unauthorized'}"
// @Failure 500 {object} map[string]interface{} "Internal server error" example:"{'error': 'Internal server error'}"
// @Router /api/userFeedback [put]
var UpdateUserFeedback = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Update User Feedback - Controller")

	var requestData map[string]interface{}
	fmt.Println(r.Body)
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, constants.REQ_BODY_FAILED, http.StatusBadRequest)
		return
	}

	userFeedbackID := uint(requestData["userFeedbackId"].(float64))

	// Create an empty UserFeedback struct
	updatedFeedback := schema.UserFeedback{}

	// Check and update each field individually if present in the request
	if description, ok := requestData["description"].(string); ok {
		updatedFeedback.Description = description
	}
	if positives, ok := requestData["positives"].(string); ok {
		updatedFeedback.Positives = positives
	}
	if negatives, ok := requestData["negatives"].(string); ok {
		updatedFeedback.Negatives = negatives
	}
	if rating, ok := requestData["rating"].(float64); ok {
		updatedFeedback.Rating = rating
	}

	userFeedbackData, err := models.UpdateUserFeedbackInDB(uint(userFeedbackID), &updatedFeedback)
	if err != nil {
		http.Error(w, constants.UPDATED_FAILED, http.StatusInternalServerError)
		return
	}

	resp := u.Message(true, constants.UPDATED_SUCCESS)
	resp[constants.DATA] = userFeedbackData
	u.Respond(w, resp)
}

// @Summary All surveys
// @Description Retrieve All surveys based on tenant ID
// @Tags Survey
// @Accept json
// @Produce json
// @Param tenant_id query int true "Tenant ID (required)" default(101)
// @Param survey_format_id query int false "Survey Format ID (optional)"
// @Param page query int true "Page (required)" default(1)
// @Param limit query int true "Limit (required)" default(5)
// @Param status query string "Status (optional)" default(completed)
// @Param accountName query string "Account Name (optional)" default(CMS)
// @Success 200 {object} map[string]interface{} "User details retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/surveys [get]
var GetAllSurveysByTenant = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	// Parse query parameters
	queryValues := r.URL.Query()
	tenantIDStr := queryValues.Get("tenant_id")
	userIDStr := queryValues.Get("user_id")
	pageStr := queryValues.Get("page")
	pageSizeStr := queryValues.Get("limit")
	statusFilter := r.URL.Query().Get("status")
	surveyFormatIDStr := r.URL.Query().Get("survey_format_id")

	accountNameParam := r.URL.Query().Get("accountName")
	var accountNameFilter []string

	if accountNameParam != "" {
		if err := json.Unmarshal([]byte(accountNameParam), &accountNameFilter); err != nil {
			http.Error(w, "Failed to decode 'accountName'", http.StatusBadRequest)
			return
		}
	}
	tenantID, _ := strconv.ParseUint(tenantIDStr, 10, 64)
	userID, _ := strconv.ParseUint(userIDStr, 10, 64)
	page, _ := strconv.Atoi(pageStr)
	pageSize, _ := strconv.Atoi(pageSizeStr)
	surveyFormatIDFilter, _ := strconv.ParseUint(surveyFormatIDStr, 10, 64)

	data, err := models.GetAllSurveysFromDB(tenantID, page, pageSize, statusFilter, accountNameFilter, userID, uint(surveyFormatIDFilter))
	if err != nil {
		http.Error(w, constants.UPDATED_FAILED, http.StatusInternalServerError)
		return
	}
	for i := range data.Surveys {
		survey := &data.Surveys[i]
		currentDateTime := time.Now()
		deadline := survey.CreatedAt.Add(time.Duration(survey.SurveyFrequencyDays) * 24 * time.Hour)
		if survey.Status == "pending" && deadline.Before(currentDateTime) {
			survey.Status = "overdue"
		}
		data.Surveys[i].DeadLine = deadline
	}
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}

var GetUserProjectDetails = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Get User Projects Details - Controller")

	user_id := r.URL.Query().Get(constants.USER_ID)
	userID64, err := strconv.ParseUint(user_id, 10, 32)
	userID := uint(userID64)
	if err != nil {
		u.Respond(w, u.Message(false, constants.INVALID_USERID))
		return
	}
	data := models.GetUserProjectsDetailsByID(userID)
	if data["status"] == false {
		errorMessage := u.Message(false, data["message"].(string))
		u.Respond(w, errorMessage)
		return
	}
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}

