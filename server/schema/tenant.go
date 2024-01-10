package schema

import (
	"github.com/jinzhu/gorm"
)

type Tenant struct {
	gorm.Model
	Name        string    `gorm:"null" json:"name"`
	Description string    `gorm:"null" json:"description"`
	Logo        string    `gorm:"null" json:"logo"`
	Location    string    `gorm:"null" json:"location"`
	IsActive    bool      `gorm:"null" json:"is_active"`
	Accounts    []Account `gorm:"ForeignKey:TenantID" json:"tenant_accounts"`
}
