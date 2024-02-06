package schema

import (
	"github.com/jinzhu/gorm"
)

// Struct to rep User
type UserInfo struct {
	gorm.Model
	Sub        string `json:"sub"`
	Name       string `gorm:"null" json:"name"`
	GivenName  string `gorm:"null" json:"given_name"`
	FamilyName string `gorm:"null" json:"family_name"`
	Email      string `gorm:"unique" json:"email"`
}
