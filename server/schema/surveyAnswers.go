package schema

import (
	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
)

// Struct to rep Project
type SurveyAnswers struct {
	gorm.Model
	QuestionID   uint           `gorm:"null" json:"question_id"`
	SurveyID     uint           `gorm:"null" json:"survey_id"`
	Answer       pq.StringArray `gorm:"type:jsonb[]" json:"answer"`
	McqQuestions *McqQuestions  `gorm:"ForeignKey:QuestionID" json:"question"`
	Comment      string         `gorm:"null" json:"comment"`
}
