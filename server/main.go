// main.go
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

	err = http.ListenAndServe(":"+port, corsHandler(router)) //Launch the app, visit localhost:8000/api
	if err != nil {
		fmt.Print(err)
	}
}
