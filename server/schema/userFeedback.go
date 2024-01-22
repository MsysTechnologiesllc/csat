package schema

import (
	"github.com/jinzhu/gorm"
)

type UserFeedback struct {
	gorm.Model
	UserID      uint   `gorm:"null" json:"user_id"`
	Description string `gorm:"null" json:"description"`
	Positives   string `gorm:"null" json:"positives"`
	Negatives   string `gorm:"null" json:"negatives"`
	Rating      float64   `gorm:"null" json:"rating"`
	SurveyID    uint   `gorm:"null" json:"survey_id"`
	User        *User  `gorm:"ForeignKey:UserID" json:"user"`
}
