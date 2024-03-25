package controllers

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/models"
	u "csat/utils"
	"net/http"
)

// @Summary Get Template Details
// @Description Retrieve template details based on Template ID
// @Tags Templates
// @Accept json
// @Produce json
// @Param id query int true "Template ID (required)" default(2)
// @Success 200 {object} map[string]interface{} "Template details retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/template-details [get]
var GetTemplateDetails = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	// Parse query parameters
	queryValues := r.URL.Query()
	id := queryValues.Get(constants.ID)
	data := models.GetTemplate(id)
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}
