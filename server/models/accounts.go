package models

import (
	constants "csat/helpers"
	"csat/schema"
	u "csat/utils"
	"fmt"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

/*
JWT claims struct
*/
type Token struct {
	UserId uint
	Email  string
	jwt.StandardClaims
}

// // a struct to rep user account
// type Account struct {
// 	gorm.Model
// 	Email    string `json:"email"`
// 	Password string `json:"password"`
// 	Token    string `json:"token";sql:"-"`
// }

type User struct {
	schema.User
}

// Validate incoming user details...
func (user *User) Validate() (map[string]interface{}, bool) {

	if !strings.Contains(user.Email, "@") {
		return u.Message(false, constants.EMAIL_REQUIRED), false
	}

	if len(user.Password) < 6 {
		return u.Message(false, constants.PASSWORD_REQUIRED), false
	}

	//Email must be unique
	temp := &User{}

	//check for errors and duplicate emails
	err := GetDB().Table("users").Where("email = ?", user.Email).First(temp).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return u.Message(false, constants.CONNECTION_ERROR), false
	}
	if temp.Email != "" {
		return u.Message(false, constants.EMAIL_EXISTS), false
	}

	return u.Message(false, constants.REQUIREMENT_PASSED), true
}

func (user *User) Create() map[string]interface{} {

	if resp, ok := user.Validate(); !ok {
		return resp
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	fmt.Println(user)

	GetDB().Create(user)

	if user.ID <= 0 {
		return u.Message(false, constants.FAILED_CREATE_USER)
	}

	//Create new JWT token for the newly registered user
	tk := &Token{UserId: user.ID, Email: user.Email}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	user.Token = tokenString

	user.Password = "" //delete password

	response := u.Message(true, constants.USER_CREATED)
	if user.AccountID == 0 {
		user.Account = nil
	}
	response["user"] = user
	return response
}

func Login(email, password string) map[string]interface{} {

	user := &User{}
	err := GetDB().Table("users").Where("email = ?", email).First(user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return u.Message(false, constants.EMAIL_NOT_FOUND)
		}
		return u.Message(false, constants.CONNECTION_ERROR)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword { //Password does not match!
		return u.Message(false, constants.INVALID_CREDENTIALS)
	}
	//Worked! Logged In
	user.Password = ""

	//Create JWT token
	tk := &Token{UserId: user.ID, Email: user.Email}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	user.Token = tokenString //Store the token in the response

	resp := u.Message(true, constants.LOGGED_IN)
	resp["user"] = user
	return resp
}

func GetUser(u uint) *User {

	acc := &User{}
	GetDB().Table("users").Where("id = ?", u).First(acc)
	if acc.Email == "" { //User not found!
		return nil
	}

	acc.Password = ""
	return acc
}
