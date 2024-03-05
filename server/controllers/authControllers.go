package controllers

import (
	constants "csat/helpers"
	"csat/models"
	"csat/schema"
	u "csat/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/tealeg/xlsx"
)

var CreateTemplate = func(w http.ResponseWriter, r *http.Request) {

	type Project struct {
		ID        int        `xlsx:"1"`
		Name      string     `xlsx:"2"`
		AccountID int        `xlsx:"3"`
		TechStack []string   `xlsx:"4"`
		StartDate *time.Time `xlsx:"5"`
		EndDate   *time.Time `xlsx:"6"`
		Active    bool       `xlsx:"7"`
	}
	filePath := "./template1.xlsx"

	// Open the Excel file
	xlFile, err := xlsx.OpenFile(filePath)
	if err != nil {
		log.Fatal(err)
	}

	// Get data from the Excel file
	var projects []Project

	// Iterate through sheets
	for _, sheet := range xlFile.Sheets {
		// Iterate through rows
		for i, row := range sheet.Rows {
			if i == 0 {
				// Skip the header row
				continue
			}

			// Extract data and create Project struct
			project := Project{}
			for j, cell := range row.Cells {
				switch j {
				case 0:
					project.ID, _ = strconv.Atoi(cell.String())
				case 1:
					project.Name = cell.String()
				case 2:
					project.AccountID, _ = strconv.Atoi(cell.String())
				case 3:
					// Unmarshal TechStack string into a slice of strings
					err := json.Unmarshal([]byte(cell.String()), &project.TechStack)
					if err != nil {
						fmt.Println("Error unmarshalling TechStack:", err)
					}
				case 4:
					date, _ := time.Parse("2006-01-02", cell.String())
					project.StartDate = &date
				case 5:
					if cell.String() != "" {
						date, _ := time.Parse("2006-01-02", cell.String())
						project.EndDate = &date
					}
				case 6:
					project.Active, _ = strconv.ParseBool(cell.String())
				}
			}

			// Add the project to the slice
			projects = append(projects, project)
		}
	}

	// Print the extracted data
	fmt.Println(projects)
}

var CreateAccount = func(w http.ResponseWriter, r *http.Request) {

	type account struct { 
		Name      string `json:"name"`
		Email     string `json:"email"`
		Password  string `json:"password"`
		Role      string `json: "role"`
		AccountID uint   `json:"account_id"`
		ProjectID uint   `json:"project_id"`
	}
	accountData := account{}
	err := json.NewDecoder(r.Body).Decode(&accountData) //decode the request body into struct and failed if any error occur
	if err != nil {
		u.Respond(w, u.Message(false, constants.INVALID_REQUEST))
		return
	}

	if accountData.Email == ""  {
        u.Respond(w, u.Message(false, "Email is required"))
        return
    }
	if  accountData.Password == "" {
        u.Respond(w, u.Message(false, "password is required"))
        return
    }
	if  accountData.AccountID == 0 {
        u.Respond(w, u.Message(false, "account ID is required"))
        return
    }
	if  accountData.ProjectID == 0 {
        u.Respond(w, u.Message(false, "Project ID is required"))
        return
    }
	// resp := accountData.Create() //Create account
	db := models.GetDB()
	user, err := models.CreateUserData(db, accountData.Name, accountData.Email, accountData.Password,  accountData.Role, accountData.AccountID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
	fmt.Println(user)
	err = models.CreateUsersProject(db, user.ID, accountData.ProjectID, user.Role)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
	userMap := map[string]interface{}{
        "user":    user,
    }
	u.Respond(w, userMap)
}

// @Summary Login API
// @Description Login API
// @Tags Users
// @Accept json
// @Produce json
// @Param email body string true "Email address" example:"Test1@yahoo.com"
// @Param password body string true "User password" example:"Test@123"
// @Success 200 {object} map[string]interface{} "User created successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/user/login [post]
var Authenticate = func(w http.ResponseWriter, r *http.Request) {

	account := &models.User{}
	err := json.NewDecoder(r.Body).Decode(account) //decode the request body into struct and failed if any error occur
	if err != nil {
		u.Respond(w, u.Message(false, constants.INVALID_REQUEST))
		return
	}

	resp := models.Login(account.Email, account.Password)

	message, _ := resp["message"].(string)

    if message == constants.EMAIL_NOT_FOUND || message == constants.INVALID_CREDENTIALS {
        w.WriteHeader(http.StatusUnauthorized)
    }
	if message == constants.CONNECTION_ERROR {
		w.WriteHeader(http.StatusInternalServerError)
	}
	u.Respond(w, resp)
}

var UpdateAccount = func(w http.ResponseWriter, r *http.Request) {

	var requestBody schema.User
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userIDStr := r.URL.Query().Get("userID")
	var userID uint
	_, err := fmt.Sscanf(userIDStr, "%d", &userID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}
	updatedUser := schema.User{}
	if requestBody.Name != "" {
		updatedUser.Name = requestBody.Name
	}
	if requestBody.Email != "" {
		updatedUser.Email = requestBody.Email
	}
	if requestBody.Password != "" {
		updatedUser.Password = requestBody.Password
	}
	if requestBody.Role != "" {
		updatedUser.Role = requestBody.Role
	}

	updatedUserPtr, err := models.UpdateUserByID(userID, &updatedUser)
	if err != nil {
		resp := u.Message(false, constants.FAILED)
		w.WriteHeader(http.StatusInternalServerError)
		u.Respond(w, resp)
		return
	}

	resp := u.Message(true, constants.SUCCESS)
	resp["data"] = updatedUserPtr
	u.Respond(w, resp)
}
