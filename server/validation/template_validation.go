package validation

import (
	constants "csat/helpers"
	"net/http"
	"strconv"
)

type Template struct {
	ID uint `validate:"required,numeric"`
}

// UserValidationMiddleware is a middleware to validate user-related parameters
func TemplateValidationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var template Template
		IDStr := r.URL.Query().Get(constants.ID)
		ID, _ := strconv.ParseUint(IDStr, 10, 32)

	    // Create an instance of User
		template.ID = uint(ID)

	    // Validate the user_id parameter
	    if err := Validator.Struct(template); err != nil {
	    	http.Error(w, err.Error(), http.StatusBadRequest)
			return
	  }
		// Call the next handler if validation is successful
		next.ServeHTTP(w, r)
	})
}