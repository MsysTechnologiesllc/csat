package controllers

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/models"
	u "csat/utils"
	"net/http"
)

var GetUserList = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from Controller")

	// Parse query parameters
	queryValues := r.URL.Query()
	name := queryValues.Get(constants.NAME)
	projectID := queryValues.Get(constants.PROJECT_ID)

	data := models.GetUsers(name, projectID)
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}
