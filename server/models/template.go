package models

import (
	"csat/logger"
	"csat/schema"
)

// @Summary Get Template Details
// @Description Retrieve template details based on Template ID
// @Tags Templates
// @Accept json
// @Produce json
// @Param id query int true "Template ID (required)" default(2)
// @Success 200 {object} map[string]interface{} "Template details retrieved successfully"
// @Failure 400 {object} map[string]interface{} "Invalid request"
// @Failure 401 {object} map[string]interface{} "Unauthorized: Token is missing or invalid"
// @Failure 404 {object} map[string]interface{} "No user found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/template-details [get]
func GetTemplate(id string) []*schema.Templates {
	var template []*schema.Templates

	if err := GetDB().Preload("McqQuestions").Where("ID = ?", id).Find(&template).Error; err != nil {
		logger.Log.Println("Error", err)
		return nil
	}

	return template
}
