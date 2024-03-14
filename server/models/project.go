package models

import (
	"bytes"
	"csat/logger"
	"csat/schema"
	"fmt"
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
		existingProject.TechStack = append(existingProject.TechStack, updatedProject.TechStack...)
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

	if !bytes.Equal(updatedAccount.Logo, []byte{}) {
		existingAccount.Logo = updatedAccount.Logo
		existingAccount.MediaType = updatedAccount.MediaType
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

func HandleAccountOwners(accountOwnersData []interface{}, accountID uint) error {
	for _, ownerData := range accountOwnersData {
		if owner, ok := ownerData.(map[string]interface{}); ok {
			accountOwner := schema.User{
				Name:      owner["name"].(string),
				Email:     owner["email"].(string),
				Password:  "",
				Role:      "accountOwner",
				AccountID: accountID,
			}

			// Check if the email already exists
			existingUser, _ := FindUserByEmail(accountOwner.Email)
			fmt.Println(existingUser)

			// If the user doesn't exist, create a new user
			if existingUser == nil {
				_, err := CreateUser(db, accountOwner.Name, accountOwner.Email, accountOwner.Role, accountOwner.AccountID)
				if err != nil {
					return err
				}
			}
		}
	}
	return nil
}

func GetProjectDetails(projectId uint) (*schema.Project, error) {
	var projectDetails schema.Project

	if err := GetDB().Preload("Users").First(&projectDetails, projectId).Error; err != nil {
		logger.Log.Println("Error fetching project details:", err)
		return nil, err
	}
	return &projectDetails, nil
}

func GetProjectUsers(projectID uint) ([]schema.User, error) {
	var users []schema.User

	// Fetch users associated with the specified project_id
	if err := db.Model(&User{}).
		Joins("JOIN user_projects ON users.id = user_projects.user_id").
		Joins("JOIN projects ON user_projects.project_id = projects.id").
		Where("user_projects.project_id = ?", projectID).
		Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}
