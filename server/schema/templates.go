package schema

import (
	"github.com/jinzhu/gorm"
)

// Struct to rep Project
type Templates struct {
	gorm.Model
	Name         string         `gorm:"null" json:"name"`
	IsActive     bool           `gorm:"default:false" json:"is_active"`
	McqQuestions []McqQuestions `gorm:"ForeignKey:TemplateID" json:"mcq_questions"`
}
