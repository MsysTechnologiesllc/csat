package controllers

import (
	constants "csat/helpers"
	"csat/models"
	u "csat/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/tealeg/xlsx"
)

var CreateTemplate = func(w http.ResponseWriter, r *http.Request) {

	type Project struct {
		ID        int        `xlsx:"1"`
		Name      string     `xlsx:"2"`
		AccountID int        `xlsx:"3"`
		TechStack []string   `xlsx:"4"`
		StartDate *time.Time `xlsx:"5"`
		EndDate   *time.Time `xlsx:"6"`
		Active    bool       `xlsx:"7"`
	}
	filePath := "./template1.xlsx"

	// Open the Excel file
	xlFile, err := xlsx.OpenFile(filePath)
	if err != nil {
		log.Fatal(err)
	}

	// Get data from the Excel file
	var projects []Project

	// Iterate through sheets
	for _, sheet := range xlFile.Sheets {
		// Iterate through rows
		for i, row := range sheet.Rows {
			if i == 0 {
				// Skip the header row
				continue
			}

			// Extract data and create Project struct
			project := Project{}
			for j, cell := range row.Cells {
				switch j {
				case 0:
					project.ID, _ = strconv.Atoi(cell.String())
				case 1:
					project.Name = cell.String()
				case 2:
					project.AccountID, _ = strconv.Atoi(cell.String())
				case 3:
					// Unmarshal TechStack string into a slice of strings
					err := json.Unmarshal([]byte(cell.String()), &project.TechStack)
					if err != nil {
						fmt.Println("Error unmarshalling TechStack:", err)
					}
				case 4:
					date, _ := time.Parse("2006-01-02", cell.String())
					project.StartDate = &date
				case 5:
					if cell.String() != "" {
						date, _ := time.Parse("2006-01-02", cell.String())
						project.EndDate = &date
					}
				case 6:
					project.Active, _ = strconv.ParseBool(cell.String())
				}
			}

			// Add the project to the slice
			projects = append(projects, project)
		}
	}

	// Print the extracted data
	fmt.Println(projects)
}

var CreateAccount = func(w http.ResponseWriter, r *http.Request) {

	account := &models.User{}
	err := json.NewDecoder(r.Body).Decode(account) //decode the request body into struct and failed if any error occur
	if err != nil {
		u.Respond(w, u.Message(false, constants.INVALID_REQUEST))
		return
	}

	resp := account.Create() //Create account
	u.Respond(w, resp)
}

var Authenticate = func(w http.ResponseWriter, r *http.Request) {

	account := &models.User{}
	err := json.NewDecoder(r.Body).Decode(account) //decode the request body into struct and failed if any error occur
	if err != nil {
		u.Respond(w, u.Message(false, constants.INVALID_REQUEST))
		return
	}

	resp := models.Login(account.Email, account.Password)
	u.Respond(w, resp)
}
