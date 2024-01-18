// routes/routes.go
package routes

import (
	"csat/app"
	"csat/controllers"

	"github.com/gorilla/mux"
)

func SetupRoutes(router *mux.Router) {
	apiRouter := router.PathPrefix("/csat/rest").Subrouter()
	apiRouter.HandleFunc("/api/user/test", controllers.CreateTemplate).Methods("GET")
	apiRouter.HandleFunc("/api/user/new", controllers.CreateAccount).Methods("POST")
	apiRouter.HandleFunc("/api/user/login", controllers.Authenticate).Methods("POST")
	apiRouter.HandleFunc("/api/team-list", controllers.GetUserList).Methods("GET")
	apiRouter.HandleFunc("/api/email", controllers.SendMail).Methods("GET")

	apiRouter.Use(app.JwtAuthentication) //attach JWT auth middleware
}
