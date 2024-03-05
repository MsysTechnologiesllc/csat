package models

import (
	constants "csat/helpers"
	"csat/schema"
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

func GetOrCreateTenant(db *gorm.DB, tenantName string) (schema.Tenant, error) {
	var tenant schema.Tenant
	if err := db.Where("name = ?", tenantName).First(&tenant).Error; err != nil {
		return tenant, fmt.Errorf("Tenant '%s' not found in the database", tenantName)
	}
	return tenant, nil
}

func GetOrCreateAccount(db *gorm.DB, accountName string) (schema.Account, error) {
	var account schema.Account
	if err := db.Where("name = ?", accountName).First(&account).Error; err != nil {
		return account, fmt.Errorf("Account '%s' not found in the database", accountName)
	}
	return account, nil
}

func GetOrCreateProject(db *gorm.DB, projectName string, accountID uint) (schema.Project, error) {
	var project schema.Project
	if err := db.Where("name = ?", projectName).First(&project).Error; err != nil {
		newProject := schema.Project{
			Name:      projectName,
			AccountID: accountID,
		}

		if err := db.Create(&newProject).Error; err != nil {
			return project, fmt.Errorf("Error creating project '%s'", projectName)
		}

		return newProject, nil
	}
	return project, nil
}

func CreateUser(db *gorm.DB, name string, email string, role string, accountId uint) (schema.User, error) {
	var existingUser schema.User

	// Check if user with the given email already exists
	if err := db.Where("email = ?", email).First(&existingUser).Error; err == nil {
		// User already exists, return the existing user
		return existingUser, nil
	}

	// User doesn't exist, create a new one
	user := schema.User{
		Name:      name,
		Email:     email,
		Role:      role,
		AccountID: accountId,
	}

	if err := db.Create(&user).Error; err != nil {
		return user, fmt.Errorf("Error creating user '%s'", name)
	}

	return user, nil
}

func CreateUserData(db *gorm.DB, name string, email string, password string, role string, accountId uint) (schema.User, error) {
	var existingUser schema.User

	// Check if user with the given email already exists
	if err := db.Where("email = ?", email).First(&existingUser).Error; err == nil {
		// User already exists, return the existing user
		return existingUser, nil
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return schema.User{}, fmt.Errorf("error hashing password: %v", err)
    }

	// User doesn't exist, create a new one
	user := schema.User{
		Name:      name,
		Email:     email,
		Password:  string(hashedPassword),		
		Role:      role,
		AccountID: accountId,
	}

	if err := db.Create(&user).Error; err != nil {
		return user, fmt.Errorf("error creating user '%s'", name)
	}

	return user, nil
}

func CreateSurveyFormat(db *gorm.DB, tenantID, accountID, projectID uint, title, message, pmName, pmEmail, dhName, dhEmail string, surveyFrequencyDays uint) (schema.SurveyFormat, error) {
	surveyFormat := schema.SurveyFormat{
		TenantID:            tenantID,
		AccountID:           accountID,
		ProjectID:           projectID,
		Title:               title,
		Message:             message,
		PMName:              pmName,
		PMEmail:             pmEmail,
		DHName:              dhName,
		DHEmail:             dhEmail,
		SurveyFrequencyDays: surveyFrequencyDays,
	}

	if err := db.Create(&surveyFormat).Error; err != nil {
		return surveyFormat, fmt.Errorf("Error creating survey format entry: %s", err.Error())
	}

	return surveyFormat, nil
}

func CreateMCQQuestion(db *gorm.DB, surveyFormatID uint, questionDescription string, questionType string, questionOptions string) (schema.McqQuestions, error) {
	mcqFormat := schema.McqQuestions{
		Description:    questionDescription,
		Type:           questionType,
		Options:        questionOptions,
		SurveyFormatID: surveyFormatID,
	}

	if err := db.Create(&mcqFormat).Error; err != nil {
		return mcqFormat, fmt.Errorf("Error creating survey format entry: %s", err.Error())
	}

	return mcqFormat, nil
}

func CreateUsersProject(db *gorm.DB, userID uint, projectID uint, role string) error {
	userProject := &schema.UserProject{
		UserID:    userID,
		ProjectID: projectID,
		Role:      role,
	}

	if err := db.Create(userProject).Error; err != nil {
		fmt.Println(err)
	}

	return nil
}

func CreateSurveyWithUserFeedbackTemplate(db *gorm.DB, surveyFormat schema.SurveyFormat, users []schema.User, mcqQuestions []schema.McqQuestions) ([]*schema.UserFeedback, []*schema.SurveyAnswers, uint, error) {
	currentDate := time.Now()
	deadline := currentDate.Add(time.Duration(constants.SURVEY_DEADLINE) * 24 * time.Hour)
	survey := schema.Survey{
		SurveyFormatID:      surveyFormat.ID,
		Name:                surveyFormat.Title,
		Description:         surveyFormat.Message,
		ProjectID:           surveyFormat.ProjectID,
		SurveyFrequencyDays: surveyFormat.SurveyFrequencyDays,
		Status:              "template",
		DeadLine:            deadline,
	}

	var userFeedbacksData []*schema.UserFeedback
	var surveyQuestionsData []*schema.SurveyAnswers
	surveyID, err := CreateSurvey(&survey)
	if err != nil {
		return nil, nil, 0, fmt.Errorf("failed to store survey in the database: %v", err)
	}

	// Create user feedbacks
	for _, userDetails := range users {
		userFeedback := &schema.UserFeedback{
			UserID:   uint(userDetails.ID),
			SurveyID: surveyID,
		}
		userFeedbacks, err := UserFeedbackCreate(userFeedback)
		if err != nil {
			return nil, nil, 0, fmt.Errorf("failed to store user feedback in the database: %v", err)
		}
		userFeedbacksData = append(userFeedbacksData, userFeedbacks)
	}

	// Create survey questions
	for _, questionDetail := range mcqQuestions {
		surveyQuestion := &schema.SurveyAnswers{
			QuestionID: uint(questionDetail.ID),
			SurveyID:   surveyID,
		}
		surveyQuestions, err := SurveyAnswersCreate(surveyQuestion)
		if err != nil {
			return nil, nil, 0, fmt.Errorf("failed to store survey question in the database: %v", err)
		}
		surveyQuestionsData = append(surveyQuestionsData, surveyQuestions)
	}

	return userFeedbacksData, surveyQuestionsData, surveyID, nil
}

func CreateSurveyWithUserFeedback(db *gorm.DB, surveyFormat schema.SurveyFormat, users []schema.User, mcqQuestions []schema.McqQuestions) ([]*schema.UserFeedback, []*schema.SurveyAnswers, uint, error) {
	currentDate := time.Now()
	deadline := currentDate.Add(time.Duration(constants.SURVEY_DEADLINE) * 24 * time.Hour)
	survey := schema.Survey{
		SurveyFormatID:      surveyFormat.ID,
		Name:                surveyFormat.Title,
		Description:         surveyFormat.Message,
		ProjectID:           surveyFormat.ProjectID,
		SurveyFrequencyDays: surveyFormat.SurveyFrequencyDays,
		Status:              "pending",
		DeadLine:            deadline,
	}

	var userFeedbacksData []*schema.UserFeedback
	var surveyQuestionsData []*schema.SurveyAnswers
	surveyID, err := CreateSurvey(&survey)
	if err != nil {
		return nil, nil, 0, fmt.Errorf("failed to store survey in the database: %v", err)
	}

	// Create user feedbacks
	for _, userDetails := range users {
		userFeedback := &schema.UserFeedback{
			UserID:   uint(userDetails.ID),
			SurveyID: surveyID,
		}
		userFeedbacks, err := UserFeedbackCreate(userFeedback)
		if err != nil {
			return nil, nil, 0, fmt.Errorf("failed to store user feedback in the database: %v", err)
		}
		userFeedbacksData = append(userFeedbacksData, userFeedbacks)
	}

	// Create survey questions
	for _, questionDetail := range mcqQuestions {
		surveyQuestion := &schema.SurveyAnswers{
			QuestionID: uint(questionDetail.ID),
			SurveyID:   surveyID,
		}
		surveyQuestions, err := SurveyAnswersCreate(surveyQuestion)
		if err != nil {
			return nil, nil, 0, fmt.Errorf("failed to store survey question in the database: %v", err)
		}
		surveyQuestionsData = append(surveyQuestionsData, surveyQuestions)
	}

	return userFeedbacksData, surveyQuestionsData, surveyID, nil
}

func UpdateSurveyFormatPMInfo(db *gorm.DB, surveyFormatID uint, pmName, pmEmail string) error {
	return db.Model(&schema.SurveyFormat{}).
		Where("ID = ?", surveyFormatID).
		Updates(map[string]interface{}{"PM_name": pmName, "PM_email": pmEmail}).Error
}

func UpdateSurveyFormatDHInfo(db *gorm.DB, surveyFormatID uint, dhName, dhEmail string) error {
	return db.Model(&schema.SurveyFormat{}).
		Where("ID = ?", surveyFormatID).
		Updates(map[string]interface{}{"DH_name": dhName, "DH_email": dhEmail}).Error
}
