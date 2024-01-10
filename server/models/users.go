package models

import (
	"csat/logger"
	"csat/schema"
	"fmt"
)

func GetUsers(name, projectID string) []map[string]interface{} {
	var users []*schema.User

	if projectID != "" {
		db := GetDB().Joins("JOIN user_projects ON users.id = user_projects.user_id").
			Joins("JOIN projects ON projects.id = user_projects.project_id").
			Where("projects.id = ?", projectID)

		if name != "" {
			db = db.Where("users.name = ?", name)
		}

		err := db.Find(&users).Error
		if err != nil {
			fmt.Println(err)
			return nil
		}
	} else {
		logger.Log.Println("Project ID Require")
		return nil
	}

	filteredUsers := make([]map[string]interface{}, len(users))
	for i, u := range users {
		filteredUsers[i] = map[string]interface{}{
			"ID":        u.ID,
			"CreatedAt": u.CreatedAt,
			"UpdatedAt": u.UpdatedAt,
			"DeletedAt": u.DeletedAt,
			"name":      u.Name,
			"email":     u.Email,
			// "company_id": u.CompanyID,
		}
	}

	return filteredUsers
}
