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
    ctx := r.Context()
    grade := ctx.Value("grade").(uint)
    userID := ctx.Value("userId").(uint)

    tenantID := r.URL.Query().Get(constants.TENANT_ID)
    tenantID64, err := strconv.ParseUint(tenantID, 10, 32)
    tenantIDUint := uint(tenantID64)
    if err != nil {
        u.Respond(w, u.Message(false, constants.INVALID_USERID))
        return
    }

    var data map[string]interface{}
    switch grade {
    case 7:
        data = models.GetAccountDetails(tenantIDUint)
    case 4, 3, 1:
        data = models.GetAccountDetails(tenantIDUint)
        data = models.FilterAccountProjects(data, userID)
    default:
		w.WriteHeader(http.StatusUnauthorized)
        u.Respond(w, u.Message(false, "You don't have permission to access"))
        return
    }

    if data["status"] == false {
        errorMessage := u.Message(false, data["message"].(string))
        u.Respond(w, errorMessage)
        return
    }
    resp := u.Message(true, constants.SUCCESS)
    resp[constants.DATA] = data
    u.Respond(w, resp)
}