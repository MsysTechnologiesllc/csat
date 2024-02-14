package controllers

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/models"
	u "csat/utils"
	"net/http"
	"strconv"
)

var GetAccountDetails = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Get User Projects Details - Controller")

	tenant_id := r.URL.Query().Get(constants.TENANT_ID)
	tenantID64, err := strconv.ParseUint(tenant_id, 10, 32)
	tenantID := uint(tenantID64)
	if err != nil {
		u.Respond(w, u.Message(false, constants.INVALID_USERID))
		return
	}
	data := models.GetAccountDetails(tenantID)
	if data["status"] == false {
		errorMessage := u.Message(false, data["message"].(string))
		u.Respond(w, errorMessage)
		return
	}
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = data
	u.Respond(w, resp)
}