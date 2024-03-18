package models

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/schema"
	u "csat/utils"

	"github.com/jinzhu/gorm"
)

func GetAccountDetails(tenantID uint) map[string]interface{} {
	var tenant schema.Tenant

	// Fetch the tenant details with the given tenantID
	if err := GetDB().Preload("Accounts", func(db *gorm.DB) *gorm.DB {
		return db.Where("is_active = ?", true)
	}).Preload("Accounts.Projects", func(db *gorm.DB) *gorm.DB {
		return db.Where("active = ?", true)
	}).Preload("Accounts.Projects.Users").Where("id = ?", tenantID).First(&tenant).Error; err != nil {
		logger.Log.Println("Error", err)
		return u.Message(false, constants.TENANT_NOT_FOUND)
	}

	// Loop through each account and fetch associated users
	for i := range tenant.Accounts {
		var accountUsers []schema.User
		db := GetDB().Joins("JOIN account_owners AS ao ON ao.user_id = users.id").
			Joins("JOIN accounts AS acc ON acc.id = ao.account_id").
			Where("acc.id = ? AND ao.is_active = ?", tenant.Accounts[i].ID, true)

		// Fetch users from the database
		if err := db.Find(&accountUsers).Error; err != nil {
			logger.Log.Println("Error fetching users", err)
			continue
		}

		// Assign fetched users to the Account struct as account owners
		tenant.Accounts[i].AccountOwner = accountUsers

		for j := range tenant.Accounts[i].Projects {
			var projectUsers []schema.User
			db := GetDB().Joins("JOIN user_projects ON users.id = user_projects.user_id").
				Joins("JOIN projects ON projects.id = user_projects.project_id").
				Where("projects.id = ? AND user_projects.is_active = ?", tenant.Accounts[i].Projects[j].ID, true)

			// Fetch users from the database
			if err := db.Find(&projectUsers).Error; err != nil {
				logger.Log.Println("Error fetching users for project", err)
				continue
			}

			// Assign fetched users to the Project struct
			tenant.Accounts[i].Projects[j].Users = projectUsers
		}
	}

	response := map[string]interface{}{
		"tenant": tenant,
	}

	return response
}

func GetAccountByID(projectId uint) (*schema.Account, error) {
	var projectDetails schema.Account

	if err := GetDB().First(&projectDetails, projectId).Error; err != nil {
		logger.Log.Println("Error fetching project details:", err)
		return nil, err
	}
	return &projectDetails, nil
}
