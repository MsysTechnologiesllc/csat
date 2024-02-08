package validation

import (
	constants "csat/helpers"
	"net/http"
	"strconv"
)

type SurveyFormat struct {
	SurveyFormat_ID uint `json:"surveyFormatID" validate:"required,numeric"`
}

func SurveyFormatValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var surveyFormat SurveyFormat
		IDStr := r.URL.Query().Get(constants.ID)
		ID, _ := strconv.ParseUint(IDStr, 10, 32)

	    // Create an instance of User
		surveyFormat.SurveyFormat_ID = uint(ID)

	    // Validate the surveyFormat_id parameter
	    if err := Validator.Struct(surveyFormat); err != nil {
	    	http.Error(w, err.Error(), http.StatusBadRequest)
			return
	  }
		// Call the next handler if validation is successful
		next.ServeHTTP(w, r)
	})
}