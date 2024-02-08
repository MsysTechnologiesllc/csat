package validation

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type UserFeedback struct {
	UserFeedbackId uint `json:"userFeedbackId" validate:"required"`
	Description string `json:"description"`
	Positives string `json:"positives"`
	Negatives string `json:"negatives"`
	Rating int `json:"rating" validate:"omitempty,min=1,max=5"`

}

func UserFeedbackValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Unable to read request body", http.StatusBadRequest)
			return
		}
		r.Body = io.NopCloser(bytes.NewBuffer(body))

		var userFeedback UserFeedback

        if err := json.Unmarshal(body, &userFeedback); err != nil {
			http.Error(w, "Unable to parse JSON request body", http.StatusBadRequest)
			return
}	
// Validate the email and password using the validator package
        if err := Validator.Struct(userFeedback); err != nil {
	    http.Error(w, fmt.Sprintf("Validation error: %s", err), http.StatusBadRequest)
	    return
}
		next.ServeHTTP(w, r)
})
}