package validation

import (
	"net/http"
	"strconv"
)

type SurveyParams struct {
	TenantID   uint64 `validate:"required"`
	Page       int    `validate:"required,gte=1"`
	PageSize   int    `validate:"required,gte=1"`
	Status     string 
	AccountName string 
}

func ALLSurveyValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		queryValues := r.URL.Query()
		tenantIDStr := queryValues.Get("tenant_id")
		pageStr := queryValues.Get("page")
		pageSizeStr := queryValues.Get("limit")
		statusFilter := r.URL.Query().Get("status")
		accountNameFilter := r.URL.Query().Get("accountName")
	
		tenantID, _ := strconv.ParseUint(tenantIDStr, 10, 64)
		page, _ := strconv.Atoi(pageStr)
		pageSize, _ := strconv.Atoi(pageSizeStr)

		 var surveyParams SurveyParams
		 surveyParams.TenantID = tenantID
		 surveyParams.Page = page
		 surveyParams.PageSize = pageSize
		 surveyParams.Status = statusFilter
		 surveyParams.AccountName = accountNameFilter

		if err := Validator.Struct(&surveyParams); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Call the next handler if validation is successful
		next.ServeHTTP(w, r)
	})
}