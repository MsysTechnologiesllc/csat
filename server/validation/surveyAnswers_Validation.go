package validation

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

// UserID represents the user ID object
type Answer struct {
	ID     int                    `json:"ID" validate:"required"`
	Answer interface{}  `json:"answer" validate:"required"`
}

type UpdateSurvey struct {
    SurveyStatus  string   `json:"survey_status" validate:"required"`
    SurveyID      int     `json:"survey_id" validate:"required"`
    SurveyAnswers []Answer `json:"survey_answers" validate:"required"`
}

func BulkSurveyAnswersValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Unable to read request body", http.StatusBadRequest)
			return
		}
		r.Body = io.NopCloser(bytes.NewBuffer(body))
	// Decode the JSON payload
	var updateData UpdateSurvey
	if err := json.Unmarshal(body, &updateData); err != nil {
		http.Error(w, "Failed to parse JSON payload", http.StatusBadRequest)
		return
	}
 
	    // Validate the user_id parameter
	    if err := Validator.Struct(updateData); err != nil {
	    	http.Error(w, err.Error(), http.StatusBadRequest)
			return
	  }
		// Call the next handler if validation is successful
		next.ServeHTTP(w, r)
	})
}
