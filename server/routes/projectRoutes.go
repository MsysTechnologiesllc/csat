package routes

import (
	"csat/controllers"

	"github.com/gorilla/mux"
)

func ProjectRoutes(router *mux.Router) {
	apiRouter := router.PathPrefix("/csat/rest").Subrouter()

	apiRouter.HandleFunc("/api/project", controllers.CreateProject).Methods("POST")
	apiRouter.HandleFunc("/api/project", controllers.UpdateProject).Methods("PUT")
	apiRouter.HandleFunc("/api/account", controllers.CreateAccountData).Methods("POST")
	apiRouter.HandleFunc("/api/account", controllers.UpdateAccountData).Methods("PUT")
}
