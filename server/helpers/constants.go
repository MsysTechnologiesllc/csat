package constants

const (
	// Error Response Messages
	INVALID_REQUEST     = "Invalid request"
	ERROR_DECODING_BODY = "Error while decoding request body"
	EMAIL_REQUIRED      = "Email address is required"
	PASSWORD_REQUIRED   = "Password is required"
	CONNECTION_ERROR    = "Connection error. Please retry"
	EMAIL_EXISTS        = "Email address already in use by another user."
	FAILED_CREATE_USER  = "Failed to create user, connection error."
	EMAIL_NOT_FOUND     = "Email address not found"
	INVALID_CREDENTIALS = "Invalid login credentials. Please try again"

	// Success Response Message
	SUCCESS            = "Success"
	REQUIREMENT_PASSED = "Requirement passed"
	USER_CREATED       = "User account has been created"
	LOGGED_IN          = "Logged In Successfully"

	// Table Names

	// DB Field Names
	NAME       = "name"
	PROJECT_ID = "project_id"

	// Others
	DATA = "data"
	USER = "user"


	// DB Connection
	DB_CONNECTED = "Connected to DB"
	DB_CONNECTION_ERROR = "DB Connection Error"
	ENV_ERROR = "ENV Loading Error"
)
