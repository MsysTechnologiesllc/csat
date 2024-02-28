package controllers

import (
	constants "csat/helpers"
	"csat/models"
	"csat/schema"
	u "csat/utils"
	"encoding/json"
	"fmt"
	"net/http"
)

var CreateProject = func(w http.ResponseWriter, r *http.Request) {
	var requestBody schema.Project
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	newProject := schema.Project{
		Name:      requestBody.Name,
		AccountID: uint(requestBody.AccountID),
		TechStack: requestBody.TechStack,
		StartDate: requestBody.StartDate,
		EndDate:   requestBody.EndDate,
		Active:    requestBody.Active,
	}

	projectData, err := models.CreateProject(&newProject)
	if err != nil {
		resp := u.Message(false, constants.FAILED)
		w.WriteHeader(http.StatusInternalServerError)
		u.Respond(w, resp)
		return
	}
	resp := u.Message(true, constants.SUCCESS)
	resp["data"] = projectData
	u.Respond(w, resp)
}

var CreateAccountData = func(w http.ResponseWriter, r *http.Request) {
	var requestBody schema.Account
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	newAccount := schema.Account{
		Name:        requestBody.Name,
		TenantID:    uint(requestBody.TenantID),
		Description: requestBody.Description,
		Logo:        requestBody.Logo,
		Location:    requestBody.Location,
		IsActive:    requestBody.IsActive,
	}

	accountData, err := models.CreateAccountData(&newAccount)
	if err != nil {
		resp := u.Message(false, constants.FAILED)
		w.WriteHeader(http.StatusInternalServerError)
		u.Respond(w, resp)
		return
	}
	resp := u.Message(true, constants.SUCCESS)
	resp["data"] = accountData
	u.Respond(w, resp)
}

var UpdateProject = func(w http.ResponseWriter, r *http.Request) {
	var requestBody schema.Project
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	projectIdStr := r.URL.Query().Get("projectId")
	var projectId uint
	_, err := fmt.Sscanf(projectIdStr, "%d", &projectId)
	if err != nil {
		http.Error(w, "Invalid account ID", http.StatusBadRequest)
		return
	}
	updatedProject := schema.Project{}

	if requestBody.Name != "" {
		updatedProject.Name = requestBody.Name
	}
	if requestBody.AccountID != 0 {
		updatedProject.AccountID = uint(requestBody.AccountID)
	}
	if len(requestBody.TechStack) != 0 {
		updatedProject.TechStack = requestBody.TechStack
	}
	if requestBody.StartDate != nil {
		updatedProject.StartDate = requestBody.StartDate
	}
	if requestBody.EndDate != nil {
		updatedProject.EndDate = requestBody.EndDate
	}
	if requestBody.Active == true || requestBody.Active == false {
		updatedProject.Active = requestBody.Active
	}

	updatedProjectPtr, err := models.UpdateProjectByID(projectId, &updatedProject)
	if err != nil {
		resp := u.Message(false, constants.FAILED)
		w.WriteHeader(http.StatusInternalServerError)
		u.Respond(w, resp)
		return
	}

	resp := u.Message(true, constants.SUCCESS)
	resp["data"] = updatedProjectPtr
	u.Respond(w, resp)
}

var UpdateAccountData = func(w http.ResponseWriter, r *http.Request) {
	var requestBody schema.Account
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	accountIdStr := r.URL.Query().Get("accountId")
	var accountId uint
	_, err := fmt.Sscanf(accountIdStr, "%d", &accountId)
	if err != nil {
		http.Error(w, "Invalid account ID", http.StatusBadRequest)
		return
	}
	updatedAccount := schema.Account{}

	if requestBody.Name != "" {
		updatedAccount.Name = requestBody.Name
	}
	if requestBody.TenantID != 0 {
		updatedAccount.TenantID = uint(requestBody.TenantID)
	}
	if len(requestBody.Description) != 0 {
		updatedAccount.Description = requestBody.Description
	}
	if requestBody.Logo != "" {
		updatedAccount.Logo = requestBody.Logo
	}
	if requestBody.Location != "" {
		updatedAccount.Location = requestBody.Location
	}
	if requestBody.IsActive == true || requestBody.IsActive == false {
		updatedAccount.IsActive = requestBody.IsActive
	}

	updatedAccountPtr, err := models.UpdateAccountByID(accountId, &updatedAccount)
	if err != nil {
		resp := u.Message(false, constants.FAILED)
		w.WriteHeader(http.StatusInternalServerError)
		u.Respond(w, resp)
		return
	}

	resp := u.Message(true, constants.SUCCESS)
	resp["data"] = updatedAccountPtr
	u.Respond(w, resp)
}
