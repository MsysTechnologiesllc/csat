package validation

import (
	constants "csat/helpers"
	"net/http"
	"strconv"
)

type Survey struct {
	ID uint `json:"id" validate:"required,numeric"`
}

func SurveyDetailsValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var survey Survey
		IDStr := r.URL.Query().Get(constants.ID)
		ID, _ := strconv.ParseUint(IDStr, 10, 32)

	    // Create an instance of Survey
		survey.ID = uint(ID)

	    // Validate the user_id parameter
	    if err := Validator.Struct(survey); err != nil {
	    	http.Error(w, err.Error(), http.StatusBadRequest)
			return
	  }
		// Call the next handler if validation is successful
		next.ServeHTTP(w, r)
	})
}
