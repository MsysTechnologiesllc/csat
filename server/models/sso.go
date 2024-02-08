package models

import (
	"csat/logger"
	"csat/schema"
	"os"
	"errors"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
)

func FindUserByEmail(email string) (*schema.User, error) {
	var user schema.User
	err := db.Where("email = ?", email).First(&user).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// User not found, return nil and no error
			return nil, nil
		}

		// Some other error occurred
		logger.Log.Println("Error fetching user details:", err)
		return nil, err
	}

	return &user, nil
}

func CreateSSOUser(db *gorm.DB, name string, email string, role string, accountId uint) (*schema.User, error) {
	user := schema.User{
		Name:  name,
		Email: email,
		Role:  role,
		AccountID:  accountId,
	}
	tk := &Token{UserId: user.ID, Email: user.Email}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	user.Token = tokenString

	if err := db.Create(&user).Error; err != nil {
		logger.Log.Println("Error Creating user:", err)
		return nil, err
	}
	return &user, nil
}
