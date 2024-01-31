package main

import (
	"csat/logger"
	"csat/models"
	"csat/routes"
	"fmt"
	"net/http"
	"os"

	cron "github.com/robfig/cron/v3"

	_ "csat/docs" // Required for Swagger docs

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	httpSwagger "github.com/swaggo/http-swagger"
)

// @title CSAT Swagger documentation
// @version 1.0
// @CSAT APIs
// @host localhost:8000
// @BasePath /csat/rest
func main() {
	cronJob := cron.New()
	_, err := cronJob.AddFunc("0 1 * * *", models.CronJob)
	if err != nil {
		fmt.Println("Error adding cron job:", err)
		return
	}
	go cronJob.Start()

	logger.Log.Printf("Microservice is Running...")
	r := mux.NewRouter()

	// Use routes.SetupRoutes function to set up routes
	routes.SetupRoutes(r)

	// Swagger documentation
	r.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"), // The URL pointing to API definition
	))

	// Enable CORS and logging middleware using gorilla/handlers
	allowedOrigins := handlers.AllowedOrigins([]string{"*"})
	allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	headersOk := handlers.AllowedHeaders([]string{"Authorization", "Content-Type"})

	// Create a logger with os.Stdout to log requests
	logging := handlers.LoggingHandler(os.Stdout, r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // localhost
	}

	logger.Log.Printf(port)

	logger.Log.Printf("Server listening on :%s...\n", port)
	http.ListenAndServe(fmt.Sprintf(":%s", port), handlers.CORS(allowedOrigins, allowedMethods, headersOk)(logging))
}
