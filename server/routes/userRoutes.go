// routes/routes.go
package routes

import (
	"csat/app"
	"csat/controllers"

	"github.com/gorilla/mux"
)

func SetupRoutes(router *mux.Router) {
	apiRouter := router.PathPrefix("/csat/rest").Subrouter()
	apiRouter.HandleFunc("/api/user/new", controllers.CreateAccount).Methods("POST")
	apiRouter.HandleFunc("/api/user/login", controllers.Authenticate).Methods("POST")
	apiRouter.HandleFunc("/api/team-list", controllers.GetUserList).Methods("GET")
	apiRouter.HandleFunc("/api/survey-details", controllers.GetSurveyDetails).Methods("GET")
	apiRouter.HandleFunc("/api/template-details", controllers.GetTemplateDetails).Methods("GET")
	apiRouter.HandleFunc("/api/survey", controllers.CreateSurvey).Methods("POST")
	apiRouter.HandleFunc("/api/user", controllers.GetUserDetails).Methods("GET")
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
	apiRouter.HandleFunc("/api/manager/survey-details", controllers.GetManagerSurveyDetails).Methods("GET")
	apiRouter.HandleFunc("/api/user/new", controllers.UpdateAccount).Methods("PUT")



	apiRouter.Use(app.JwtAuthentication) //attach JWT auth middleware
}
