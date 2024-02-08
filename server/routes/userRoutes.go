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
	apiRouter.HandleFunc("/api/user/new", controllers.CreateAccount).Methods("POST")
	apiRouter.HandleFunc("/api/user/login", controllers.Authenticate).Methods("POST")
	apiRouter.Handle("/api/team-list", validation.TeamListValidation(http.HandlerFunc(controllers.GetUserList))).Methods("GET")
	apiRouter.Handle("/api/survey-details", validation.SurveyDetailsValidation(http.HandlerFunc(controllers.GetSurveyDetails))).Methods("GET")
	apiRouter.HandleFunc("/api/template-details", controllers.GetTemplateDetails).Methods("GET")
	apiRouter.Handle("/api/survey", validation.CreateSurveyValidation(http.HandlerFunc(controllers.CreateSurvey))).Methods("POST")

	apiRouter.HandleFunc("/api/user", controllers.GetUserDetails).Methods("GET")
	apiRouter.Handle("/api/userFeedback", validation.UserFeedbackValidation(http.HandlerFunc(controllers.UpdateUserFeedback))).Methods("PUT")
	apiRouter.Handle("/api/surveys", validation.ALLSurveyValidation(http.HandlerFunc(controllers.GetAllSurveysByTenant))).Methods("GET")


	apiRouter.HandleFunc("/api/populateDB", controllers.UpdateDataFromExcel).Methods("POST") ///
	apiRouter.Handle("/api/survey-format", validation.SurveyFormatValidation(http.HandlerFunc(controllers.GetSurveyFormatByID))).Methods("GET")
	apiRouter.Handle("/api/survey-answers", validation.BulkSurveyAnswersValidation(http.HandlerFunc(controllers.BulkUpdateSurveyAnswers))).Methods("PUT")

	apiRouter.Use(app.JwtAuthentication) //attach JWT auth middleware
}
  