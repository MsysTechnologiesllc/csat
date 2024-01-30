package schema

import (
	"time"

	"github.com/jinzhu/gorm"
)

// Struct to rep Project
type Survey struct {
	gorm.Model
	Name                string          `gorm:"null" json:"name"`
	Description         string          `gorm:"null" json:"description"`
	StartedAt           *time.Time      `gorm:"type:timestamptz" json:"started_at"`
	CompletedAt         *time.Time      `gorm:"type:timestamptz" json:"completed_at"`
	Status              string          `gorm:"null" json:"status"`
	ProjectID           uint            `gorm:"null" json:"project_id"`
	SurveyFormatID      uint            `gorm:"null" json:"survey_format_id"`
	UserFeedback        []UserFeedback  `gorm:"ForeignKey:SurveyID" json:"user_feedbacks"`
	SurveyAnswers       []SurveyAnswers `gorm:"ForeignKey:SurveyID" json:"survey_answers"`
	Project             *Project        `gorm:"ForeignKey:ProjectID" json:"project"`
	SurveyFrequencyDays uint            `gorm:"null" json:"survey_frequency_days"`
}
