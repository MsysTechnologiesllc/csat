package schema

import (
	"github.com/jinzhu/gorm"
)

type UserProject struct {
	gorm.Model
	UserID    uint   `gorm:"not null" json:"user_id"`
	ProjectID uint   `gorm:"not null" json:"project_id"`
	Role      string `gorm:"null" json:"user_role"`
	IsActive  bool   `gorm:"null" json:"is_active"`
}
