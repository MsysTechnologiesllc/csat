// logger/logger.go
package logger

import (
	"log"
	"sync"
	"time"

	rotatelogs "github.com/lestrrat-go/file-rotatelogs"
)

var (
	once sync.Once
	Log  *log.Logger
)

func initLogger() {
	// Set log rotation settings
	logPath := "logs/app.log"
	logWriter, err := rotatelogs.New(
		logPath+".%Y%m%d",
		rotatelogs.WithLinkName(logPath),
		rotatelogs.WithMaxAge(24*time.Hour),
		rotatelogs.WithRotationTime(24*time.Hour),
	)

	if err != nil {
		log.Fatalf("Failed to initialize log rotation: %v", err)
	}

	// Create a logger with the specified log writer
	Log = log.New(logWriter, "", log.LstdFlags)
}

func init() {
	once.Do(initLogger)
}
