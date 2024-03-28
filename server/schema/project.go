package schema

import (
	"time"

	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
)

// Struct to rep Project
type Project struct {
	gorm.Model
	Name      string         `gorm:"unique" json:"name"`
	AccountID uint           `gorm:"null" json:"account_id"`
	TechStack pq.StringArray `gorm:"type:varchar(255)[]" json:"tech_stack"`
	StartDate *time.Time     `gorm:"type:timestamptz" json:"start_date"`
	EndDate   *time.Time     `gorm:"type:timestamptz" json:"end_date"`
	Active    bool           `gorm:"default:false" json:"active"`
	Logo      []byte         `gorm:"type:BLOB" json:"logo"`
	MediaType string         `gorm:"null" json:"media_type"`
	Users     []User         `gorm:"many2many:user_projects;"`
}
