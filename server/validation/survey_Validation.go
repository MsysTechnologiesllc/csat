package validation

import (
	"encoding/json"
	"io"
	"net/http"
	"bytes"
)

// UserID represents the user ID object
type UserID struct {
	ID uint `json:"id" validate:"required"`
}

// Question represents the question object
type Question struct {
	ID uint `json:"id" validate:"required"`
}

type CreateSurvey struct {
	Name        string    `json:"name" validate:"required"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	UserID      []UserID  `json:"userId" validate:"required,dive"`
	Questions   []Question `json:"questions" validate:"required,dive"`
}

func CreateSurveyValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Unable to read request body", http.StatusBadRequest)
			return
		}
		r.Body = io.NopCloser(bytes.NewBuffer(body))
	// Decode the JSON payload
	var createSurvey CreateSurvey
	if err := json.Unmarshal(body, &createSurvey); err != nil {
		http.Error(w, "Failed to parse JSON payload", http.StatusBadRequest)
		return
	}
 
	    // Validate the user_id parameter
	    if err := Validator.Struct(createSurvey); err != nil {
	    	http.Error(w, err.Error(), http.StatusBadRequest)
			return
	  }
		// Call the next handler if validation is successful
		next.ServeHTTP(w, r)
	})
}