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
	}).Preload("Accounts.Projects").Preload("Accounts.Projects.Users").Where("id = ?", tenantID).First(&tenant).Error; err != nil {
        logger.Log.Println("Error", err)
        return u.Message(false, constants.TENANT_NOT_FOUND)
    }

    response := map[string]interface{}{
        "tenant": tenant,
    }

    return response
}

