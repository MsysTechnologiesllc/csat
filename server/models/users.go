package models

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/schema"
	u "csat/utils"
	"fmt"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

/*
JWT claims struct
*/
type Token struct {
	UserId   uint
	Email    string
	TenantId uint
	Grade    uint
	jwt.StandardClaims
}

type User struct {
	schema.User
}

// Validate incoming user details...
func (user *User) Validate() (map[string]interface{}, bool) {

	if !strings.Contains(user.Email, "@") {
		return u.Message(false, constants.EMAIL_REQUIRED), false
	}

	if len(user.Password) < 6 {
		return u.Message(false, constants.PASSWORD_REQUIRED), false
	}

	//Email must be unique
	temp := &User{}

	//check for errors and duplicate emails
	err := GetDB().Table("users").Where("email = ?", user.Email).First(temp).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return u.Message(false, constants.CONNECTION_ERROR), false
	}
	if temp.Email != "" {
		return u.Message(false, constants.EMAIL_EXISTS), false
	}

	return u.Message(false, constants.REQUIREMENT_PASSED), true
}

func (user *User) Create() map[string]interface{} {

	if resp, ok := user.Validate(); !ok {
		return resp
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	fmt.Println(user)

	GetDB().Create(user)

	if user.ID <= 0 {
		return u.Message(false, constants.FAILED_CREATE_USER)
	}

	//Create new JWT token for the newly registered user
	tk := &Token{UserId: user.ID, Email: user.Email}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	user.Token = tokenString

	user.Password = "" //delete password

	response := u.Message(true, constants.USER_CREATED)
	if user.AccountID == 0 {
		user.Account = nil
	}
	response["user"] = user
	return response
}

type LoginRequest struct {
	Email    string `json:"email" example:"Test1@yahoo.com"`
	Password string `json:"password" example:"Test@123"`
}

// @Summary Login User
// @Description Login existing user
// @Tags Users
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Login request"
// @Success 200 {object} map[string]interface{} "User created successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/user/login [post]
func Login(email, password string) map[string]interface{} {
	user := &User{}
	err := GetDB().Table("users").Where("email = ?", email).Preload("Account").First(user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return u.Message(false, constants.EMAIL_NOT_FOUND)
		}
		return u.Message(false, constants.CONNECTION_ERROR)
	}
	fmt.Println(user.Account.TenantID)

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword { //Password does not match!
		return u.Message(false, constants.INVALID_CREDENTIALS)
	}
	//Worked! Logged In
	user.Password = ""

	// Based on the user role assign rank
	var grade uint
	switch user.Role {
	case "deliveryHead":
		grade = 7
	case "accountOwner":
		grade = 4
	case "manager":
		grade = 3
	case "lead":
		grade = 1
	default:
		grade = 0
	}

	//Create JWT token
	tk := &Token{UserId: user.ID, Email: user.Email, TenantId: user.Account.TenantID, Grade: grade}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	user.Token = tokenString //Store the token in the response

	resp := u.Message(true, constants.LOGGED_IN)
	resp["user"] = user
	return resp
}

func GetUser(u uint) *User {

	acc := &User{}
	GetDB().Table("users").Where("id = ?", u).First(acc)
	if acc.Email == "" { //User not found!
		return nil
	}

	acc.Password = ""
	return acc
}

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
func GetUsersList(name, projectID string) map[string]interface{} {
	var users []*schema.User

	if projectID != "" {
		db := GetDB().Joins("JOIN user_projects ON users.id = user_projects.user_id").
			Joins("JOIN projects ON projects.id = user_projects.project_id").
			Where("projects.id = ? AND is_active = ?", projectID, true)

		if name != "" {
			db = db.Where("users.name = ?", name)
		}

		err := db.Find(&users).Error
		if err != nil {
			fmt.Println(err)
			return nil
		}
	} else {
		logger.Log.Println(constants.PROJECT_ID_REQUIRED)
		return nil
	}

	var clients []map[string]interface{}
	var regularUsers []map[string]interface{}

	for _, u := range users {
		userData := map[string]interface{}{
			"ID":         u.ID,
			"CreatedAt":  u.CreatedAt,
			"UpdatedAt":  u.UpdatedAt,
			"DeletedAt":  u.DeletedAt,
			"name":       u.Name,
			"email":      u.Email,
			"role":       u.Role,
			"account_id": u.AccountID,
		}

		if u.Role == "client" {
			clients = append(clients, userData)
		} else {
			regularUsers = append(regularUsers, userData)
		}
	}

	response := map[string]interface{}{
		"users":   regularUsers,
		"clients": clients,
	}

	return response
}

// @Summary Get user Details
// @Description Retrieve user details based on User ID
// @Tags Users
// @Accept json
// @Produce json
// @Param user_id query int true "User ID (required)" default(2)
// @Security ApiKeyAuth
// @Success 200 {object} map[string]interface{} "User details retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/user [get]
func GetUserDetailsByID(userID uint) map[string]interface{} {
	var user schema.User

	if err := GetDB().Preload("Account").Preload("Projects").Where("id = ?", userID).First(&user).Error; err != nil {
		logger.Log.Println("Error", err)
		return u.Message(false, constants.USER_NOT_FOUND)
	}

	if user.Account == nil {
		return u.Message(false, constants.ACCOUNT_NOT_FOUND)
	}

	var account schema.Tenant
	if err := GetDB().Where("id = ?", user.Account.TenantID).Find(&account).Error; err != nil {
		logger.Log.Println("Error", err)
		return u.Message(false, constants.TENANT_NOT_FOUND)
	}

	response := map[string]interface{}{
		"user":   user,
		"tenant": account,
	}

	return response
}

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
func UpdateUserFeedbackInDB(id uint, updatedFeedback *schema.UserFeedback) (*schema.UserFeedback, error) {
	var existingUserFeedback schema.UserFeedback

	// Find the existing user feedback by ID
	result := GetDB().First(&existingUserFeedback, id)
	if result.Error != nil {
		return nil, result.Error
	}

	// Update the fields with values from the request body
	existingUserFeedback.Description = updatedFeedback.Description
	existingUserFeedback.Positives = updatedFeedback.Positives
	existingUserFeedback.Negatives = updatedFeedback.Negatives
	existingUserFeedback.Rating = updatedFeedback.Rating

	// Save the updated user feedback to the database
	result = GetDB().Save(&existingUserFeedback)
	if result.Error != nil {
		return nil, result.Error
	}

	return &existingUserFeedback, nil
}

type SurveyPage struct {
	Surveys        []schema.Survey
	TotalCount     int
	CompletedCount int
	PendingCount   int
	OverdueCount   int
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
// @Param status query string false "Status (optional)"
// @Param accountName query string false "Account Name (optional)" default(CMS)
// @Success 200 {object} map[string]interface{} "User details retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/surveys [get]
func GetAllSurveysFromDB(tenantID uint64, page, pageSize int, statusFilter string, accountNameFilter []string, userID uint64, surveyFormatIDFilter uint, surveyNameFilter string) (SurveyPage, error) {
	var result SurveyPage

	query := db.
		Preload("Project").
		Preload("UserFeedback").
		Preload("UserFeedback.User").
		Preload("SurveyAnswers").
		Preload("SurveyAnswers.McqQuestions").
		Joins("JOIN projects ON surveys.project_id = projects.id").
		Joins("JOIN accounts ON projects.account_id = accounts.id").
		Joins("JOIN user_projects ON projects.id = user_projects.project_id").
		Where("user_projects.user_id = ?", userID).
		Where("accounts.tenant_id = ?", tenantID).
		Not("surveys.status = ?", "template")

	// Apply search filters
	if statusFilter != "" {
		if statusFilter == "overdue" {
			query = query.Where("surveys.status = 'pending' AND surveys.dead_line < NOW()")
		} else if statusFilter == "pending" {
			query = query.Where("surveys.status = 'pending' AND surveys.dead_line >= NOW()")
		} else {
			query = query.Where("surveys.status = ?", statusFilter)
		}
	}

	if surveyNameFilter != "" {
		query = query.Where("surveys.name IN (?)", surveyNameFilter)
	}

	if len(accountNameFilter) > 0 {
		query = query.Where("projects.name IN (?)", accountNameFilter)
	}

	if surveyFormatIDFilter != 0 {
		query = query.Where("surveys.survey_format_id = ?", surveyFormatIDFilter)
	}

	// Get the count with applied filters
	filteredCount := 0
	pendingCount := 0
	overdueCount := 0
	publishedCount := 0
	if err := query.Model(&schema.Survey{}).Count(&filteredCount).Error; err != nil {
		return result, err
	}

	// Count pending surveys
	if err := db.Model(&schema.Survey{}).Where("surveys.status = 'pending' AND surveys.dead_line >= NOW()").Count(&pendingCount).Error; err != nil {
		return result, err
	}

	// Count overdue surveys
	if err := db.Model(&schema.Survey{}).Where("surveys.status = 'pending' AND surveys.dead_line < NOW()").Count(&overdueCount).Error; err != nil {
		return result, err
	}

	// Count published surveys
	if err := db.Model(&schema.Survey{}).Where("surveys.status = 'publish'").Count(&publishedCount).Error; err != nil {
		return result, err
	}

	// Calculate offset based on page and pageSize
	offset := (page - 1) * pageSize

	// Implement pagination
	query = query.Offset(offset).Limit(pageSize)

	if err := query.Find(&result.Surveys).Error; err != nil {
		return result, err
	}

	// Set the total count in the result struct
	result.TotalCount = filteredCount
	result.PendingCount = pendingCount
	result.OverdueCount = overdueCount
	result.CompletedCount = publishedCount

	return result, nil
}

func GetUsersByProjectID(projectID uint) ([]schema.User, error) {
	var users []schema.User

	// Fetch users associated with the specified project_id
	if err := db.Model(&User{}).
		Joins("JOIN user_projects ON users.id = user_projects.user_id").
		Joins("JOIN projects ON user_projects.project_id = projects.id").
		Where("user_projects.project_id = ?", projectID).
		Preload("Projects").
		Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func GetUserProjectsDetailsByID(userID uint) map[string]interface{} {
	var user schema.User

	if err := GetDB().Preload("Projects").Where("id = ?", userID).First(&user).Error; err != nil {
		logger.Log.Println("Error", err)
		return u.Message(false, constants.USER_NOT_FOUND)
	}

	// Extract project details
	var projects []schema.Project
	projects = user.Projects

	response := map[string]interface{}{
		"projects": projects, // Include project details in the response
	}
	return response
}

func GetUsersListByProjectID(projectID uint) ([]schema.User, error) {
	var users []schema.User

	if projectID != 0 {
		db := GetDB().Joins("JOIN user_projects ON users.id = user_projects.user_id").
			Joins("JOIN projects ON projects.id = user_projects.project_id").
			Where("projects.id = ?", projectID)

		// Fetch users from the database
		if err := db.Find(&users).Error; err != nil {
			return nil, fmt.Errorf("Error fetching users: %v", err)
		}
	} else {
		return nil, fmt.Errorf("Project ID is required")
	}

	return users, nil
}

func UpdateUserLoginToken(id uint, user *schema.User) (*schema.User, error) {
	var existingUser schema.User

	// Find the existing user feedback by ID
	result := GetDB().First(&existingUser, id)
	if result.Error != nil {
		return nil, result.Error
	}

	existingUser.Token = user.Token

	// Save the updated user feedback to the database
	result = GetDB().Save(&existingUser)
	if result.Error != nil {
		return nil, result.Error
	}

	return &existingUser, nil
}

func UpdateUserByID(userID uint, updatedUser *schema.User) (*schema.User, error) {
	var existingUser schema.User

	err := db.Where("id = ?", userID).First(&existingUser).Error
	if err != nil {
		return nil, err
	}

	if updatedUser.Name != "" {
		existingUser.Name = updatedUser.Name
	}
	if updatedUser.Email != "" {
		existingUser.Email = updatedUser.Email
	}
	if updatedUser.Password != "" {
		// Hash the new password before saving it
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(updatedUser.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		existingUser.Password = string(hashedPassword)
	}
	if updatedUser.Role != "" {
		existingUser.Role = updatedUser.Role
	}

	if err := db.Save(&existingUser).Error; err != nil {
		return nil, err
	}

	return &existingUser, nil
}
