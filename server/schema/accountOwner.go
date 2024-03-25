package schema

import (
	"github.com/jinzhu/gorm"
)

type AccountOwner struct {
	gorm.Model
	UserID    uint   `gorm:"not null" json:"user_id"`
	AccountID uint   `gorm:"not null" json:"account_id"`
	Role      string `gorm:"null" json:"user_role"`
	IsActive  bool   `gorm:"null" json:"is_active"`
}
