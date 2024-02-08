package validation

import (
	constants "csat/helpers"
	"net/http"
	"strconv"
)

type TeamList struct {
    Name           string `json:"name"`
    ProjectID      uint   `json:"project_id" validate:"required,numeric"`
}

func TeamListValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var team TeamList
		name := r.URL.Query().Get(constants.NAME)
	projectID := r.URL.Query().Get(constants.PROJECT_ID)
	ID, _ := strconv.ParseUint(projectID, 10, 32)

	    // Create an instance of survey
		team.Name = name
		team.ProjectID = uint(ID)

	    if err := Validator.Struct(team); err != nil {
	    	http.Error(w, err.Error(), http.StatusBadRequest)
			return
	  }
		// Call the next handler if validation is successful
		next.ServeHTTP(w, r)
	})
}