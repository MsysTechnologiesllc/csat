package controllers

import (
	"crypto/rand"
	constants "csat/helpers"
	"csat/logger"
	"csat/models"
	"csat/schema"
	u "csat/utils"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	googleOauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("REDIRECT_URL"),
		Scopes:       []string{"profile", "email"},
		Endpoint:     google.Endpoint,
	}

	state string
)

func generateRandomState() (string, error) {
	randomBytes := make([]byte, 32)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(randomBytes), nil
}

func init() {
	var err error
	state, err = generateRandomState()
	if err != nil {
		fmt.Println("Error generating random state:", err)
		return
	}
}

func GoogleLoginHandler(w http.ResponseWriter, r *http.Request) {
	url := googleOauthConfig.AuthCodeURL(state)
	fmt.Println(url)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func GoogleAuthCallbackHandler(w http.ResponseWriter, r *http.Request) {
	var accessToken struct {
		AccessToken string `json:"access_token"`
	}
	var userDetails schema.User

	if err := json.NewDecoder(r.Body).Decode(&accessToken); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid request body: %v", err)
		return
	}

	// Get user information from Google
	client := googleOauthConfig.Client(r.Context(), &oauth2.Token{AccessToken: accessToken.AccessToken})
	req, err := http.NewRequest("GET", os.Getenv("GOOGLE_USER_INFO"), nil)
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", "Bearer "+accessToken.AccessToken)

	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Failed to fetch user data", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var userInfo schema.UserInfo
	if err := decodeJSON(resp.Body, &userInfo); err != nil {
		http.Error(w, "Failed to decode user data", http.StatusInternalServerError)
		return
	}

	// Check if the user already exists in the database based on the email
	existingUser, err := models.FindUserByEmail(userInfo.Email)
	if err != nil {
		http.Error(w, "Error checking user existence", http.StatusInternalServerError)
		return
	}

	if existingUser != nil {
		existingUser.Password = ""
		tk := schema.Token{UserId: existingUser.ID, Email: existingUser.Email, TenantId: existingUser.Account.TenantID}
		token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
		tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
		existingUser.Token = tokenString

		_, err := models.UpdateUserLoginToken(uint(existingUser.ID), existingUser)
		if err != nil {
			u.Respond(w, u.Message(false, "Error in updating user token"))
			return
		}
		userDetails = *existingUser
	} else {
		// User does not exist, create a new user in the database
		response := u.Message(false, "User does not exist. Please check with your administrator.")
		u.Respond(w, response)
		return
	}
	response := u.Message(true, "Loggin successful")
	response["data"] = userDetails
	u.Respond(w, response)
}

func decodeJSON(r io.Reader, v interface{}) error {
	return json.NewDecoder(r).Decode(v)
}

var CustomerLogin = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Customer login - Controller")
	var requestData struct {
		Passcode string `json:"passcode"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	if requestData.Passcode == "" {
		http.Error(w, "Survey ID and Passcode are required fields", http.StatusBadRequest)
		return
	}
	surveyData, err := models.GetSurveyForLogin(requestData.Passcode)
	if err != nil {
		u.Respond(w, u.Message(false, constants.INVALID_SURVEYID))
		return
	}
	if requestData.Passcode != surveyData.Survey.Passcode {
		resp := u.Message(false, constants.FAILED)
		resp[constants.DATA] = constants.PASSCODE_MISMATCH
		w.WriteHeader(http.StatusUnauthorized)
		u.Respond(w, resp)
		return
	}
	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = map[string]interface{}{
		"ID":      surveyData.Survey.ID,
		"Passcode": surveyData.Survey.Passcode,
	}
	u.Respond(w, resp)
}
