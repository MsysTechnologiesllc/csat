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
	INVALID_USERID      = "Invalid UserID"
	USER_NOT_FOUND      = "User not found or unable to fetch details"
	ACCOUNT_NOT_FOUND   = "Account not found for this user"
	TENANT_NOT_FOUND    = "Tenant not found for this user"
	TOKEN_MISSING       = "Missing auth token"
	TOKEN_INVALID       = "Invalid/Malformed authentication token"
	REQ_BODY_FAILED     = "Failed to decode JSON request body"
	PROJECT_ID_REQUIRED = "Project Id required"

	// Success Response Message
	SUCCESS            = "Success"
	REQUIREMENT_PASSED = "Requirement passed"
	USER_CREATED       = "User account has been created"
	LOGGED_IN          = "Logged In Successfully"
	UPDATED_SUCCESS    = "Data Updated Successfully"
	UPDATED_FAILED     = "Data Updated Failed"

	// Table Names

	// DB Field Names
	NAME       = "name"
	PROJECT_ID = "project_id"
	ID         = "id"
	USER_ID    = "user_id"

	// Others
	DATA   = "data"
	USER   = "user"
	SURVEY = "survey"
	TENANT = "tenant"

	// DB Connection
	DB_CONNECTED        = "Connected to DB"
	DB_CONNECTION_ERROR = "DB Connection Error"
	ENV_ERROR           = "ENV Loading Error"

	// user roles
	PROJECT_MANAGER = "projectManager"
	DELIVERY_HEAD = "deliveryHead"
)
