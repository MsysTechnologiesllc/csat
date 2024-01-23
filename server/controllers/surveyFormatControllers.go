package controllers

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/models"
	"csat/schema"
	u "csat/utils"
	"fmt"
	"net/http"

	"github.com/tealeg/xlsx"
)

var UpdateDataFromExcel = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Update Data from Excel - Controller")

	filePath := "DB_Data.xlsx"

	xlFile, err := xlsx.OpenFile(filePath)
	if err != nil {
		u.Respond(w, u.Message(false, "Error opening Excel file"))
		return
	}

	db := models.GetDB()

	var tenant schema.Tenant
	var account schema.Account
	var project schema.Project
	tenantFound := false
	accountFound := false

	var title, message, pmName, pmEmail, dhName, dhEmail string

	var surveyFormat schema.SurveyFormat
	var surveyFormatCreated bool
	var users []schema.User
	var mcqQuestions []schema.McqQuestions

	for _, sheet := range xlFile.Sheets {
		if sheet.Name == "project" {
			for i, row := range sheet.Rows {
				if i == 0 {
					continue
				}
				tenantName := row.Cells[0].String()
				accountName := row.Cells[1].String()
				projectName := row.Cells[2].String()
				title = row.Cells[3].String()
				message = row.Cells[4].String()
				pmName = row.Cells[5].String()
				pmEmail = row.Cells[6].String()
				dhName = row.Cells[7].String()
				dhEmail = row.Cells[8].String()

				tenant, err = models.GetOrCreateTenant(db, tenantName)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				account, err = models.GetOrCreateAccount(db, accountName)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				project, err = models.GetOrCreateProject(db, projectName, account.ID)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				userPM, err := models.CreateUser(db, pmName, pmEmail, "Project Manager")
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				userDH, err := models.CreateUser(db, dhName, dhEmail, "Delivery Head")
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				err = models.CreateUsersProject(db, userPM.ID, project.ID, userPM.Role)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				err = models.CreateUsersProject(db, userDH.ID, project.ID, userDH.Role)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				tenantFound = true
				accountFound = true

				if !surveyFormatCreated {
					surveyFormat, err = models.CreateSurveyFormat(db, tenant.ID, account.ID, project.ID, title, message, pmName, pmEmail, dhName, dhEmail, 7)
					if err != nil {
						http.Error(w, err.Error(), http.StatusInternalServerError)
						return
					}
					surveyFormatCreated = true
				}

				break
			}
		}

		if sheet.Name == "questions" && tenantFound && accountFound && surveyFormatCreated {
			for i, row := range sheet.Rows {
				if i == 0 {
					continue
				}
				questionDescription := row.Cells[0].String()
				questionType := row.Cells[1].String()
				questionOptions := row.Cells[2].String()

				mcqQuestion, err := models.CreateMCQQuestion(db, surveyFormat.ID, questionDescription, questionType, questionOptions)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				mcqQuestions = append(mcqQuestions, mcqQuestion)
			}
		}
		if sheet.Name == "users" && tenantFound && accountFound && surveyFormatCreated {
			for i, row := range sheet.Rows {
				if i == 0 {
					continue
				}
				userName := row.Cells[0].String()
				userEmail := row.Cells[1].String()
				userRole := row.Cells[2].String()

				user, err := models.CreateUser(db, userName, userEmail, userRole)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				users = append(users, user)

				err = models.CreateUsersProject(db, user.ID, project.ID, user.Role)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			}
		}
	}

	if !tenantFound {
		http.Error(w, "No tenant entry found in the Excel sheet", http.StatusInternalServerError)
		return
	}

	if !accountFound {
		http.Error(w, "No account entry found in the Excel sheet", http.StatusInternalServerError)
		return
	}

	//creating new survey
	survey := schema.Survey{
		Name:        surveyFormat.Title,
		Description: surveyFormat.Message,
		Status:      "pending",
	}

	var userFeedbacksData []*schema.UserFeedback
	var surveyQuestionsData []*schema.SurveyAnswers
	surveyID, err := models.CreateSurvey(&survey)
	if err != nil {
		http.Error(w, "Failed to store survey in the database", http.StatusInternalServerError)
		return
	}

	for _, userDetails := range users {
		// Create user feedback
		userFeedback := &schema.UserFeedback{
			UserID:   uint(userDetails.ID),
			SurveyID: surveyID,
		}
		userFeedbacks, err := models.UserFeedbackCreate(userFeedback)
		if err != nil {
			http.Error(w, "Failed to store survey in the database", http.StatusInternalServerError)
			return
		}
		userFeedbacksData = append(userFeedbacksData, userFeedbacks)
	}

	for _, questionDetail := range mcqQuestions {
		// Create questions
		surveyQuestion := &schema.SurveyAnswers{
			QuestionID: uint(questionDetail.ID),
			SurveyID:   surveyID,
		}
		surveyQuestions, err := models.SurveyAnswersCreate(surveyQuestion)
		if err != nil {
			http.Error(w, "Failed to store survey in the database", http.StatusInternalServerError)
			return
		}
		surveyQuestionsData = append(surveyQuestionsData, surveyQuestions)
	}

	//Sending mail
	for _, user := range users {
		// fullURL := fmt.Sprintf("http://test.com/csat?surveyid=%d", surveyID)
		if user.Role == "client" {
			emailData := u.EmailData{
				Name:        user.Name,
				ProjectName: project.Name,
				SurveyID: fmt.Sprintf("http://test.com/csat?surveyid=%d", surveyID),
			}
			emailRecipient := u.EmailRecipient{
				To:      []string{"rbalachandar@msystechnologies.com"},
				Subject: "Survey Mail",
			}

			templateName := "email_template"

			// Send mail using the populated emailData and emailRecipient
			err := u.SendMail(templateName, emailData, emailRecipient)
			if err != nil {
				logger.Log.Printf("Failed to send email for user with ID %d: %v\n", user.ID, err)
			}
		}
	}
	

	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = map[string]interface{}{"tenant": tenant, "account": account, "project": project, "surveyFormat": surveyFormat, "surveyID": surveyID, "userFeedbacksData": userFeedbacksData, "surveyAnswersData": surveyQuestionsData}
	u.Respond(w, resp)
}
