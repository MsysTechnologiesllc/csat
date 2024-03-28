package app

import (
	"context"
	constants "csat/helpers"
	"csat/models"
	u "csat/utils"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

var JwtAuthentication = func(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		notAuth := []string{"/csat/rest/api/user/new", "/csat/rest/api/user/login", "/csat/rest/api/survey-details", "/csat/rest/api/manager/survey-details", "/csat/rest/api/survey-answers" , "/csat/rest/api/userFeedback", "/swagger/"}
		requestPath := r.URL.Path

		// Check if the request is made from Swagger UI
		referer := r.Header.Get("Referer")
		if strings.Contains(referer, "/swagger/index.html") {
			next.ServeHTTP(w, r)
			return
		}

		for _, value := range notAuth {

			if value == requestPath {
				next.ServeHTTP(w, r)
				return
			}
		}

		response := make(map[string]interface{})
		tokenHeader := r.Header.Get("Authorization")

		if tokenHeader == "" {
			response = u.Message(false, constants.TOKEN_MISSING)
			w.WriteHeader(http.StatusForbidden)
			w.Header().Add("Content-Type", "application/json")
			u.Respond(w, response)
			return
		}

		splitted := strings.Split(tokenHeader, " ")
		if len(splitted) != 2 {
			response = u.Message(false, constants.TOKEN_INVALID)
			w.WriteHeader(http.StatusForbidden)
			w.Header().Add("Content-Type", "application/json")
			u.Respond(w, response)
			return
		}

		tokenPart := splitted[1]
		tk := &models.Token{}

		token, err := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("token_password")), nil
		})

		if err != nil {
			response = u.Message(false, constants.TOKEN_INVALID)
			w.WriteHeader(http.StatusForbidden)
			w.Header().Add("Content-Type", "application/json")
			u.Respond(w, response)
			return
		}

		if !token.Valid {
			response = u.Message(false, constants.TOKEN_INVALID)
			w.WriteHeader(http.StatusForbidden)
			w.Header().Add("Content-Type", "application/json")
			u.Respond(w, response)
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, "userId", tk.UserId)
		ctx = context.WithValue(ctx, "email", tk.Email)
		ctx = context.WithValue(ctx, "token", tk.TenantId)
		ctx = context.WithValue(ctx, "grade", tk.Grade)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
