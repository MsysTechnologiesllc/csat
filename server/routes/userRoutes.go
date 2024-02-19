// routes/routes.go
package routes

import (
	"csat/app"
	"csat/controllers"
	"csat/validation"
	"net/http"

	"github.com/gorilla/mux"
)

func SetupRoutes(router *mux.Router) {
	apiRouter := router.PathPrefix("/csat/rest").Subrouter()
	apiRouter.Handle("/api/user/new", validation.LoginValidationMiddleware(http.HandlerFunc(controllers.CreateAccount))).Methods("POST")
	apiRouter.Handle("/api/user/login", validation.LoginValidationMiddleware(http.HandlerFunc(controllers.Authenticate))).Methods("POST")
	apiRouter.HandleFunc("/api/team-list", controllers.GetUserList).Methods("GET")
	apiRouter.HandleFunc("/api/survey-details", controllers.GetSurveyDetails).Methods("GET")
	apiRouter.Handle("/api/template-details", validation.TemplateValidationMiddleware(http.HandlerFunc(controllers.GetTemplateDetails))).Methods("GET")
	apiRouter.HandleFunc("/api/survey", controllers.CreateSurvey).Methods("POST")
	apiRouter.Handle("/api/user", validation.UserValidationMiddleware(http.HandlerFunc(controllers.GetUserDetails))).Methods("GET")
	
	apiRouter.HandleFunc("/api/userFeedback", controllers.UpdateUserFeedback).Methods("PUT")
	apiRouter.HandleFunc("/api/surveys", controllers.GetAllSurveysByTenant).Methods("GET")

	apiRouter.HandleFunc("/api/populateDB", controllers.UpdateDataFromExcel).Methods("POST")
	apiRouter.HandleFunc("/api/survey-format", controllers.GetSurveyFormatByID).Methods("GET")
	apiRouter.HandleFunc("/api/survey-answers", controllers.BulkUpdateSurveyAnswers).Methods("PUT")
	apiRouter.HandleFunc("/api/user-projects", controllers.GetUserProjectDetails).Methods("GET")
	apiRouter.HandleFunc("/api/account", controllers.GetAccountDetails).Methods("GET")
	apiRouter.HandleFunc("/api/survey-clone", controllers.CloneSurvey).Methods("POST")
	apiRouter.HandleFunc("/api/client", controllers.CreateClient).Methods("POST")
	apiRouter.HandleFunc("/api/survey-format/list", controllers.GetSurveyFormatList).Methods("GET")



	apiRouter.Use(app.JwtAuthentication) //attach JWT auth middleware
}
