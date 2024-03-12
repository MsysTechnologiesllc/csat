package models

import (
	"csat/logger"
	"csat/schema"
	"csat/utils"
	"errors"
	"fmt"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
)

func FindUserByEmail(email string) (*schema.User, error) {
	var user schema.User
	err := db.Where("email = ?", email).Preload("Account").First(&user).Error

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

func SendResetPasswordMail(userDetails *schema.User, token string) error {
	resetURL := fmt.Sprintf("%s?user_id=%d&token=%s", os.Getenv("RESET_PASSWORD_LINK"), userDetails.ID, token)
	emailData := utils.EmailData{
		Name:        userDetails.Name,
		SurveyID:    resetURL,
	}
	emailRecipient := utils.EmailRecipient{
		To:      []string{userDetails.Email},
		Subject: "Reset password link",
	}
	templateName := "reset_password"

	return utils.SendMail(templateName, emailData, emailRecipient)
}

func UpdateUserPassword(user *schema.User) error {
    err := db.Save(user).Error
    return err
}

func SearchUsersList(search string) (*[]schema.User, error) {
	var users []schema.User

	if err := GetDB().Where("name ILIKE ? OR email ILIKE ?", "%"+search+"%", "%"+search+"%").Find(&users).Error; err != nil {
		logger.Log.Println("Error fetching Users details:", err)
		return nil, err
	}
	return &users, nil
}
