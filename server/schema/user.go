package schema

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
)

// Struct to rep User
type User struct {
	gorm.Model
	Name      string    `gorm:"null" json:"name"`
	Email     string    `gorm:"unique" json:"email"`
	Password  string    `json:"password"`
	Role      string    `gorm:"null" json:"role"`
	Token     string    `json:"token"`
	AccountID uint      `gorm:"null" json:"account_id"`
	Account   *Account  `gorm:"ForeignKey:AccountID" json:"account"`
	Projects  []Project `gorm:"many2many:user_projects;" json:"user_projects"`
}

type Token struct {
	UserId uint
	Email  string
	jwt.StandardClaims
}
