package schema

import (
	"time"

	"github.com/jinzhu/gorm"
)

// Struct to rep Project
type Project struct {
	gorm.Model
	Name      string     `gorm:"null" json:"name"`
	AccountID uint       `gorm:"null" json:"account_id"`
	TechStack []string   `gorm:"type:varchar(255)[]" json:"tech_stack"`
	StartDate *time.Time `gorm:"type:timestamp" json:"start_date"`
	EndDate   *time.Time `gorm:"type:timestamp" json:"end_date"`
	Active    bool       `gorm:"default:false" json:"active"`
	Users     []User     `gorm:"many2many:user_projects;"`
}
