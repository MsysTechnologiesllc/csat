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
