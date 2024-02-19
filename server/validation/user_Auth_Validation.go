package validation

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type LoginRequest struct {
	Email string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func LoginValidationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Unable to read request body", http.StatusBadRequest)
			return
		}
		r.Body = io.NopCloser(bytes.NewBuffer(body))

		var loginRequest LoginRequest

        if err := json.Unmarshal(body, &loginRequest); err != nil {
			http.Error(w, "Unable to parse JSON request body", http.StatusBadRequest)
			return
}	
// Validate the email and password using the validator package
        if err := Validator.Struct(loginRequest); err != nil {
	    http.Error(w, fmt.Sprintf("Validation error: %s", err), http.StatusBadRequest)
	    return
}
		next.ServeHTTP(w, r)
})
}