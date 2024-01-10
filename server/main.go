// main.go
package main

import (
	"csat/logger"
	"csat/routes"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	logger.Log.Printf("Microservice is running...")
	router := mux.NewRouter()

	// Use the SetupRoutes function from the routes package to set up routes
	routes.SetupRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" //localhost
	}

	logger.Log.Printf(port)

	err := http.ListenAndServe(":"+port, router) //Launch the app, visit localhost:8000/api
	if err != nil {
		fmt.Print(err)
	}
}
