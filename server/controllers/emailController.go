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
	emailRecipient := utils.EmailRecipient{
		To : []string{"sharmar@msystechnologies.com", "rahulsharmafriends48@gmail.com"},
		Subject: "Surevy Mail",
	}
	templateName := "email_template"

	err := utils.SendMail(templateName, emailData, emailRecipient)
	if err != nil {
		log.Fatal(err)
	}
}