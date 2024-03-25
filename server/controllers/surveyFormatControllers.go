package controllers

import (
	constants "csat/helpers"
	"csat/logger"
	"csat/models"
	"csat/schema"
	u "csat/utils"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

	"github.com/tealeg/xlsx"
)

var UpdateDataFromExcel = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Update Data from Excel - Controller")

	err := r.ParseMultipartForm(10 << 20) // 10 MB limit
	if err != nil {
		u.Respond(w, u.Message(false, "Unable to parse form"))
		return
	}
	var fileName string

	for key := range r.MultipartForm.File {
		fileName = key
		break
	}

	// Check if any files were uploaded
	fileHeaders, ok := r.MultipartForm.File[fileName]
	if !ok || len(fileHeaders) == 0 {
		u.Respond(w, u.Message(false, "No file uploaded"))
		return
	}

	// Open the file directly without using r.FormFile
	file, err := fileHeaders[0].Open()
	if err != nil {
		u.Respond(w, u.Message(false, "Unable to open file"))
		return
	}
	defer file.Close()

	// Create a temporary file to store the uploaded file
	tempFile, err := os.CreateTemp("", "temp-excel-*.xlsx")
	if err != nil {
		u.Respond(w, u.Message(false, "Unable to create temporary file"))
		return
	}
	defer tempFile.Close()

	// Copy the uploaded file to the temporary file
	_, err = io.Copy(tempFile, file)
	if err != nil {
		u.Respond(w, u.Message(false, "Unable to copy file"))
		return
	}

	// Open the Excel file
	xlFile, err := xlsx.OpenFile(tempFile.Name())
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
				surveyFrequencyStr := row.Cells[5].String()

				surveyFrequency, err := strconv.ParseUint(surveyFrequencyStr, 10, 0)
				if err != nil {
					fmt.Printf("Error converting surveyFrequencyStr to uint: %v\n", err)
					surveyFrequency = 0
				}

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

				tenantFound = true
				accountFound = true

				if !surveyFormatCreated {
					surveyFormat, err = models.CreateSurveyFormat(db, tenant.ID, account.ID, project.ID, title, message, pmName, pmEmail, dhName, dhEmail, uint(surveyFrequency))
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

				user, err := models.CreateUser(db, userName, userEmail, userRole, account.ID)
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

				// Update SurveyFormat table based on userRole
				switch userRole {
				case constants.PROJECT_MANAGER:
					err = models.UpdateSurveyFormatPMInfo(db, surveyFormat.ID, user.Name, user.Email)
					if err != nil {
						http.Error(w, err.Error(), http.StatusInternalServerError)
						return
					}
				case constants.DELIVERY_HEAD:
					err = models.UpdateSurveyFormatDHInfo(db, surveyFormat.ID, user.Name, user.Email)
					if err != nil {
						http.Error(w, err.Error(), http.StatusInternalServerError)
						return
					}
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

	var userFeedbacksData []*schema.UserFeedback
	var surveyQuestionsData []*schema.SurveyAnswers
	var surveyID uint

	userFeedbacks, surveyQuestions, surveyId, err := models.CreateSurveyWithUserFeedbackTemplate(db, surveyFormat, users, mcqQuestions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	userFeedbacksData = userFeedbacks
	surveyQuestionsData = surveyQuestions
	surveyID = surveyId

	// linkURL := os.Getenv("EMAIL_BASE_URL")
	// //Sending mail
	// for _, user := range users {
	// 	if user.Role == "client" {
	// 		userFeedbacks, surveyQuestions, surveyId, err := models.CreateSurveyWithUserFeedback(db, surveyFormat, users, mcqQuestions)
	// 		if err != nil {
	// 			http.Error(w, err.Error(), http.StatusInternalServerError)
	// 			return
	// 		}
	// 		userFeedbacksData = userFeedbacks
	// 		surveyQuestionsData = surveyQuestions
	// 		surveyID := strconv.Itoa(int(surveyId))

	// 		emailData := u.EmailData{
	// 			Name:        user.Name,
	// 			ProjectName: project.Name,
	// 			SurveyID:    linkURL + surveyID,
	// 		}
	// 		emailRecipient := u.EmailRecipient{
	// 			To:      []string{user.Email},
	// 			Subject: "Survey Mail",
	// 		}

	// 		templateName := "email_template"

	// 		// Send mail using the populated emailData and emailRecipient
	// 		err = u.SendMail(templateName, emailData, emailRecipient)
	// 		if err != nil {
	// 			logger.Log.Printf("Failed to send email for user with ID %d: %v\n", user.ID, err)
	// 		}
	// 	}
	// }
	AccountIDString := fmt.Sprintf("%d", account.ID)
	projectIDString := fmt.Sprintf("%d", project.ID)
	previewURL := os.Getenv("TEMPLATE_PREVIEW_URL") + AccountIDString + "/projects/" + projectIDString + "/formatlist/previewSurvey"

	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = map[string]interface{}{"preview_url": previewURL, "tenant": tenant, "account": account, "project": project, "surveyFormat": surveyFormat, "surveyID": surveyID, "userFeedbacksData": userFeedbacksData, "surveyAnswersData": surveyQuestionsData}
	u.Respond(w, resp)
}
