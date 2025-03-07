package initializers

import (
	"awesomeProject1/model"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file ")
	}
}

var DB *gorm.DB

func ConnectDB() {
	var err error
	// Konfiguracja DSN dla PostgreSQL
	dsn := "host=" + os.Getenv("DB_HOST") +
		" port=" + os.Getenv("DB_PORT") +
		" user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASSWORD") +
		" dbname=" + os.Getenv("DB_NAME") +
		" sslmode=disable"

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
}
func CreateTables() {
	err := DB.AutoMigrate(model.User{}, model.Emotions{}, model.Img{})
	if err != nil {
		panic("Failed to create tables: " + err.Error())
	}
}
