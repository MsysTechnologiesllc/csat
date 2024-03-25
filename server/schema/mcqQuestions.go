package schema

import (
	"github.com/jinzhu/gorm"
)

// Struct to rep Account
type McqQuestions struct {
	gorm.Model
	Description    string `gorm:"null" json:"description"`
	Type           string `gorm:"null" json:"type"`
	Options        string `gorm:"type:text" json:"options"`
	TemplateID     uint   `gorm:"null" json:"template_id"`
	SurveyFormatID uint   `gorm:"null" json:"survey_format_id"`
}
