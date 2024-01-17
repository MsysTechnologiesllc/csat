package schema

import (
	"github.com/jinzhu/gorm"
)

type UserFeedback struct {
	gorm.Model
	UserID      uint   `gorm:"null" json:"user_id"`
	Description string `gorm:"unique" json:"description"`
	Rating      uint   `gorm:"unique" json:"rating"`
	SurveyID    uint   `gorm:"null" json:"survey_id"`
}
