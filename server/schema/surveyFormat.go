package schema

import (
	"github.com/jinzhu/gorm"
)

type SurveyFormat struct {
	gorm.Model
	TenantID            uint            `gorm:"not null" json:"tenant_id"`
	AccountID           uint            `gorm:"not null" json:"account_id"`
	ProjectID           uint            `gorm:"not null" json:"project_id"`
	Title               string          `gorm:"null" json:"title"`
	Message             string          `gorm:"null" json:"message"`
	PMName              string          `gorm:"null" json:"PM_name"`
	PMEmail             string          `gorm:"null" json:"PM_email"`
	DHName              string          `gorm:"null" json:"DH_name"`
	DHEmail             string          `gorm:"null" json:"DH_email"`
	SurveyFrequencyDays uint            `gorm:"null" json:"survey_frequency_days"`
	Surveys             []*Survey       `gorm:"ForeignKey:SurveyFormatID" json:"surveys"`
	McqQuestions        []*McqQuestions `gorm:"ForeignKey:SurveyFormatID" json:"questions"`
}
