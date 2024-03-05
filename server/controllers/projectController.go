package controllers

import (
	constants "csat/helpers"
	"csat/models"
	"csat/schema"
	u "csat/utils"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
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
		Active:    true,
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

type LogoData struct {
	MediaType   string `json:"mediaType"`
	DecodedData []byte `json:"decodedData"`
}

var CreateAccountData = func(w http.ResponseWriter, r *http.Request) {
	var requestBody map[string]interface{}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	if err := json.Unmarshal(body, &requestBody); err != nil {
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	// Extract logo data from base64 string
	var decodedData []byte
	var mediaType string

	if logoBase64, ok := requestBody["logo"].(string); ok && logoBase64 != "" {
		dataURIParts := strings.SplitN(logoBase64, ",", 2)
		if len(dataURIParts) != 2 {
			http.Error(w, "Invalid Data URI format", http.StatusBadRequest)
			return
		}

		mediaType = dataURIParts[0]
		base64Data := dataURIParts[1]

		// Decode base64 data
		var err error
		decodedData, err = base64.StdEncoding.DecodeString(base64Data)
		if err != nil {
			http.Error(w, "Error decoding URI", http.StatusBadRequest)
			return
		}
		maxSizeBytes := 2 * 1024 * 1024 // 2 MB
		if len(decodedData) > maxSizeBytes {
			http.Error(w, "File size exceeds the limit", http.StatusBadRequest)
			return
		}
	}

	newAccount := schema.Account{
		Name:        requestBody["name"].(string),
		TenantID:    uint(requestBody["tenant_id"].(float64)),
		Description: "",
		Logo:        decodedData,
		Location:    "",
		IsActive:    true,
		MediaType:   mediaType,
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
	var requestBody map[string]interface{}
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

	if name, ok := requestBody["name"].(string); ok && name != "" {
		updatedAccount.Name = name
	}

	if tenantID, ok := requestBody["tenant_id"].(float64); ok && tenantID != 0 {
		updatedAccount.TenantID = uint(tenantID)
	}

	if description, ok := requestBody["description"].(string); ok && len(description) != 0 {
		updatedAccount.Description = description
	}

	if logo, ok := requestBody["logo"].(string); ok && logo != "" {
		dataURIParts := strings.SplitN(logo, ",", 2)
		if len(dataURIParts) != 2 {
			fmt.Println("Invalid Data URI format")
			return
		}

		mediaType := dataURIParts[0]
		base64Data := dataURIParts[1]
		fmt.Println(mediaType)

		// Decode base64 data
		decodedData, err := base64.StdEncoding.DecodeString(base64Data)
		if err != nil {
			fmt.Println("Error decoding base64:", err)
			return
		}
		maxSizeBytes := 2 * 1024 * 1024 // 2 MB
		if len(decodedData) > maxSizeBytes {
			http.Error(w, "File size exceeds the limit", http.StatusBadRequest)
			return
		}
		updatedAccount.Logo = decodedData
		updatedAccount.MediaType = mediaType
	}

	if location, ok := requestBody["location"].(string); ok && location != "" {
		updatedAccount.Location = location
	}

	if isActive, ok := requestBody["is_active"].(bool); ok {
		updatedAccount.IsActive = isActive
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
