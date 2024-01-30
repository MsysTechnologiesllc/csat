package models

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/schema"
	"fmt"
	"net/url"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
)

var db *gorm.DB

func init() {

	e := godotenv.Load()
	if e != nil {
		fmt.Print(e)
		logger.Log.Fatal(constants.ENV_ERROR, e)
	}

	username := os.Getenv("db_user")
	password := os.Getenv("db_pass")
	dbName := os.Getenv("db_name")
	dbHost := os.Getenv("db_host")
	dbPort := os.Getenv("db_port")

	encodedPassword := url.QueryEscape(password)

	dbUri := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", username, encodedPassword, dbHost, dbPort, dbName)
	logger.Log.Printf(dbUri)
	logger.Log.Println(constants.DB_CONNECTED)

	conn, err := gorm.Open("postgres", dbUri)
	if err != nil {
		fmt.Print(err)
		logger.Log.Fatal(constants.DB_CONNECTION_ERROR, err)
	}

	db = conn
	db.Debug().AutoMigrate(&schema.Tenant{}, &schema.Account{}, &schema.Project{}, &schema.User{}, &schema.UserProject{}, &schema.UserFeedback{}, &schema.McqQuestions{}, &schema.SurveyFormat{}, &schema.Survey{}, &schema.SurveyAnswers{})
}

func GetDB() *gorm.DB {
	return db
}
