package routes

import (
	"csat/controllers"

	"github.com/gorilla/mux"
)

func SetupGoogleRoutes(router *mux.Router) {
	apiRouter := router.PathPrefix("/csat/rest").Subrouter()
	apiRouter.HandleFunc("/auth/google", controllers.GoogleLoginHandler).Methods("GET")
	apiRouter.HandleFunc("/auth/google/update", controllers.GoogleAuthCallbackHandler).Methods("POST")
	apiRouter.HandleFunc("/auth/customer-login", controllers.CustomerLogin).Methods("POST")
	apiRouter.HandleFunc("/auth/reset-password/link", controllers.ResetPasswordLink).Methods("GET")
	apiRouter.HandleFunc("/auth/reset-password", controllers.ResetPassword).Methods("PUT")
	apiRouter.HandleFunc("/auth/search", controllers.SearchUser).Methods("GET")

}
