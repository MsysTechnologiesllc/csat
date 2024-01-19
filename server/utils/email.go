package utils

import (
	"html/template"
	"net/smtp"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
)

// Load environment variables from .env file
func init() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
}

// EmailData struct represents the data to be passed to the email template.
type EmailData struct {
	Name        string
	ProjectName string
}

type EmailRecipient struct {
	To      []string
	Subject string
}

// Config struct holds configuration values for sending emails.
type Config struct {
	SMTPServer   string
	SMTPPort     string
	SenderEmail  string
	SenderName   string
	SenderPass   string
	TemplateName string
}

// sendMail sends an email using the provided configuration and data.
func SendMail(templateName string, data EmailData, r EmailRecipient ) error {
	
	// templateFile := templateName + ".html"
	templateFile := filepath.Join("templates", templateName+".html")
	tmpl, err := template.ParseFiles(templateFile)
	if err != nil {
		return err
	}

	// Create buffer to store rendered template
	var bodyText string
	buffer := &TemplateBuffer{&bodyText}


	// Render template with data
	err = tmpl.Execute(buffer, data)
	if err != nil {
		return err
	}

	config := &Config{
		SMTPServer:   os.Getenv("SMTP_SERVER"),
		SMTPPort:     os.Getenv("SMTP_PORT"),
		SenderEmail:  os.Getenv("SENDER_EMAIL"),
		SenderPass:   os.Getenv("SENDER_PASS"),
	}


	// SMTP server configuration
	smtpServer := config.SMTPServer + ":" + config.SMTPPort
	auth := smtp.PlainAuth("", config.SenderEmail, config.SenderPass, config.SMTPServer)

	// Compose the email
	to := r.To // Change this to the recipient's email address
	msg := []byte("To: " + strings.Join(r.To, ",") + "\r\n" +
		"Subject: " + r.Subject + "\r\n" +
		"Content-Type: text/html\r\n" +
		"\r\n" +
		bodyText)

	// Send the email
	err = smtp.SendMail(smtpServer, auth, config.SenderEmail, to, msg)
	if err != nil {
		return err
	}

	return nil
}

// TemplateBuffer is a custom type to capture the output of template execution.
type TemplateBuffer struct {
	*string
}

// Write method appends the data to the buffer.
func (b *TemplateBuffer) Write(p []byte) (n int, err error) {
	*b.string += string(p)
	return len(p), nil
}