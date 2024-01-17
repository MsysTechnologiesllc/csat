// main.go
package main

import (
	"csat/logger"
	"csat/routes"
	"fmt"
	"net/http"
	"os"

	_ "csat/docs" // Required for Swagger docs

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	httpSwagger "github.com/swaggo/http-swagger"
)

// @title Your Microservice API
// @version 1.0
// @description Your Microservice API with Swagger documentation
// @host localhost:8080
// @BasePath /api/v1
func main() {
	logger.Log.Printf("Microservice is Running...")
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
	)
	router := mux.NewRouter()

	// Use the SetupRoutes function from the routes package to set up routes
	router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))
	routes.SetupRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" //localhost
	}

	logger.Log.Printf(port)

	err := http.ListenAndServe(":"+port, corsHandler(router)) //Launch the app, visit localhost:8000/api
	if err != nil {
		fmt.Print(err)
	}
}
