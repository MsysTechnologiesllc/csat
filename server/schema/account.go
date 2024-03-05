package schema

import (
	"github.com/jinzhu/gorm"
)

// Struct to rep Account
type Account struct {
	gorm.Model
	TenantID    uint      `gorm:"null" json:"tenant_id"`
	Name        string    `gorm:"null" json:"name"`
	Description string    `gorm:"null" json:"description"`
	Logo        []byte    `gorm:"type:BLOB" json:"logo"`
	Location    string    `gorm:"null" json:"location"`
	IsActive    bool      `gorm:"null" json:"is_active"`
	Projects    []Project `gorm:"ForeignKey:AccountID" json:"account_projects"`
	MediaType   string    `gorm:"null" json:"media_type"`
}
