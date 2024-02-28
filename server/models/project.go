package models

import (
	"csat/schema"
)

func CreateProject(projectData *schema.Project) (*schema.Project, error) {
	err := GetDB().Create(projectData).Error
	if err != nil {
		return nil, err
	}
	return projectData, nil
}

func CreateAccountData(accountData *schema.Account) (*schema.Account, error) {
	err := GetDB().Create(accountData).Error
	if err != nil {
		return nil, err
	}
	return accountData, nil
}

func UpdateProjectByID(projectID uint, updatedProject *schema.Project) (*schema.Project, error) {
	var existingProject schema.Project

	// Assuming 'db' is your GORM database connection
	err := db.Where("id = ?", projectID).First(&existingProject).Error
	if err != nil {
		return nil, err
	}

	// Update the existing project with the fields from updatedProject
	if updatedProject.Name != "" {
		existingProject.Name = updatedProject.Name
	}

	if updatedProject.AccountID != 0 {
		existingProject.AccountID = updatedProject.AccountID
	}

	if len(updatedProject.TechStack) != 0 {
		existingProject.TechStack = updatedProject.TechStack
	}

	if updatedProject.StartDate != nil {
		existingProject.StartDate = updatedProject.StartDate
	}

	if updatedProject.EndDate != nil {
		existingProject.EndDate = updatedProject.EndDate
	}

	if updatedProject.Active {
		existingProject.Active = updatedProject.Active
	} else {
		existingProject.Active = false
	}

	// Save the updated project back to the database
	if err := db.Save(&existingProject).Error; err != nil {
		return nil, err
	}

	return &existingProject, nil
}

func UpdateAccountByID(projectID uint, updatedAccount *schema.Account) (*schema.Account, error) {
	var existingAccount schema.Account

	err := db.Where("id = ?", projectID).First(&existingAccount).Error
	if err != nil {
		return nil, err
	}

	if updatedAccount.Name != "" {
		existingAccount.Name = updatedAccount.Name
	}

	if updatedAccount.TenantID != 0 {
		existingAccount.TenantID = updatedAccount.TenantID
	}

	if updatedAccount.Description != "" {
		existingAccount.Description = updatedAccount.Description
	}

	if updatedAccount.Logo != "" {
		existingAccount.Logo = updatedAccount.Logo
	}

	if updatedAccount.Location != "" {
		existingAccount.Location = updatedAccount.Location
	}

	if updatedAccount.IsActive {
		existingAccount.IsActive = updatedAccount.IsActive
	} else {
		existingAccount.IsActive = false
	}

	if err := db.Save(&existingAccount).Error; err != nil {
		return nil, err
	}

	return &existingAccount, nil
}
