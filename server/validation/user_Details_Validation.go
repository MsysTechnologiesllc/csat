package validation

import (
	constants "csat/helpers"
	"net/http"
	"strconv"
)

type User struct {
	UserID uint `validate:"required,numeric"`
}

// UserValidationMiddleware is a middleware to validate user-related parameters
func UserValidationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var user User
		userIDStr := r.URL.Query().Get(constants.USER_ID)
		userID, _ := strconv.ParseUint(userIDStr, 10, 32)

	    // Create an instance of User
	      user.UserID = uint(userID)

	    // Validate the user_id parameter
	    if err := Validator.Struct(user); err != nil {
	    	http.Error(w, err.Error(), http.StatusBadRequest)
			return
	  }
		// Call the next handler if validation is successful
		next.ServeHTTP(w, r)
	})
}