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
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
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
		"ID":       surveyData.Survey.ID,
		"Passcode": surveyData.Survey.Passcode,
	}
	u.Respond(w, resp)
}

var ResetPasswordLink = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from reset password link Controller")

	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	existingUser, err := models.FindUserByEmail(email)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":  email,
		"userId": existingUser.ID,
		"exp":    time.Now().Add(15 * time.Minute).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("token_password")))
	if err != nil {
		fmt.Println("Error creating token:", err)
		return
	}

	if err := models.SendResetPasswordMail(existingUser, tokenString); err != nil {
		logger.Log.Printf("Failed to send email for %s: %v\n", existingUser.Email, err)
		resp := u.Message(false, constants.FAILED)
		resp[constants.DATA] = "Failed to send Reset password link"
		w.WriteHeader(http.StatusUnauthorized)
		u.Respond(w, resp)
	}

	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = "Reset password link sent"
	u.Respond(w, resp)
}

var ResetPassword = func(w http.ResponseWriter, r *http.Request) {
	logger.Log.Println("Logging from reset password Controller")

	var requestData struct {
		Email           string `json:"email"`
		Token           string `json:"token"`
		NewPassword     string `json:"new_password"`
		ConfirmPassword string `json:"confirm_password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, err := jwt.Parse(requestData.Token, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("token_password")), nil
	})

	if err != nil || !token.Valid {
		http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, "Failed to extract token claims", http.StatusInternalServerError)
		return
	}

	if email, ok := claims["email"].(string); !ok || email != requestData.Email {
		http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		return
	}
	if exp, ok := claims["exp"].(float64); ok {
        expirationTime := time.Unix(int64(exp), 0)
        if time.Now().After(expirationTime) {
            http.Error(w, "Token has expired", http.StatusUnauthorized)
            return
        }
    } else {
        http.Error(w, "Token expiration time not found", http.StatusUnauthorized)
        return
    }

	if requestData.NewPassword != requestData.ConfirmPassword {
		http.Error(w, "New password and confirm password do not match", http.StatusBadRequest)
		return
	}

	existingUser, err := models.FindUserByEmail(requestData.Email)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestData.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	existingUser.Password = string(hashedPassword)

	if err := models.UpdateUserPassword(existingUser); err != nil {
		http.Error(w, "Failed to update user password", http.StatusInternalServerError)
		return
	}

	resp := u.Message(true, constants.SUCCESS)
	resp[constants.DATA] = "Password reset successfully"
	u.Respond(w, resp)
}
