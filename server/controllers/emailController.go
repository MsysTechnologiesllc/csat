package controllers

import (
	"csat/utils"
	"log"
	"net/http"
)

var SendMail = func(w http.ResponseWriter, r *http.Request) {
	// Example usage
	// emailData := EmailData{Name: "John Doe", ProjectName: "Awesome Project"}
	emailData := utils.EmailData{
		Name:        "John Doe",
		ProjectName: "Awesome Project",
	}
	templateName := "email_template"

	err := utils.SendMail(templateName, emailData)
	if err != nil {
		log.Fatal(err)
	}
}