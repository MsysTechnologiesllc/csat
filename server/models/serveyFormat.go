package models

import (
	"csat/schema"
	"fmt"

	"github.com/jinzhu/gorm"
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

func CreateUser(db *gorm.DB, name, email, role string) (schema.User, error) {
	user := schema.User{
		Name:  name,
		Email: email,
		Role:  role,
	}

	if err := db.Create(&user).Error; err != nil {
		return user, fmt.Errorf("Error creating user '%s'", name)
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
		Description: questionDescription,
		Type: questionType,
		Options: questionOptions,
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
		return err
	}

	return nil
}
