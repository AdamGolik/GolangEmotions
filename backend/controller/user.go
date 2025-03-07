package controller

import (
	"awesomeProject1/initializers"
	"awesomeProject1/model"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"time"
)

func Register(c *gin.Context) {
	type Body struct {
		Email           string `json:"email"`
		UserName        string `json:"user_name"`
		Password        string `json:"password"`
		PasswordConfirm string `json:"PasswordConfirm"`
		Public          bool   `json:"public"`
	}
	var req Body
	if req.Password != req.PasswordConfirm {
		c.AbortWithStatusJSON(400, gin.H{"error": "Passwords do not match"})
		return
	}
	if c.Bind(&req) != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": "Invalid request"})
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": "Invalid request"})
	}

	user := model.User{Email: req.Email, Password: string(hash), UserName: req.UserName, Public: req.Public}
	result := initializers.DB.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User created successfully",
	})
}
func Login(c *gin.Context) {
	type Body struct {
		Email           string `json:"email"`
		Password        string `json:"password"`
		PasswordConfirm string `json:"PasswordConfirm"`
	}
	var req Body
	if req.Password != req.PasswordConfirm {
		c.AbortWithStatusJSON(400, gin.H{"error": "Passwords do not match"})
		return
	}
	if c.Bind(&req) != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": "Invalid request"})
	}

	// Znajdź użytkownika
	var user model.User
	initializers.DB.First(&user, "email = ?", req.Email)

	if user.Id == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Nieprawidłowe dane logowania",
		})
		return
	}

	// Porównaj hasła
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Nieprawidłowe dane logowania",
		})
		return
	}

	// Generuj JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.Id,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Błąd podczas generowania tokenu",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
	})
}
func UpdateAccount(c *gin.Context) {
	type Body struct {
		Email           string `json:"email"`
		UserName        string `json:"user_name"`
		Password        string `json:"password"`
		PasswordConfirm string `json:"PasswordConfirm"`
		Public          bool   `json:"public"`
	}
	var req Body
	if c.Bind(&req) != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": "Invalid request"})
		return
	}
	if req.Password != req.PasswordConfirm {
		c.AbortWithStatusJSON(400, gin.H{"error": "Passwords do not match"})
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": "Error hashing password"})
		return
	}

	// Get user ID from token
	userID := c.MustGet("userID").(int16)

	var user model.User
	if err := initializers.DB.First(&user, userID).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update user fields
	user.Email = req.Email
	user.Password = string(hash)
	user.UserName = req.UserName
	user.Public = req.Public

	result := initializers.DB.Save(&user)
	if result.Error != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user account"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
	})
}
func GetAccount(c *gin.Context) {
	userid := c.MustGet("userID").(int16)
	var user model.User
	initializers.DB.First(&user, userid)
	c.JSON(http.StatusOK, user)
}

func DeleteAccount(c *gin.Context) {
	userid := c.MustGet("userID").(int16)
	var user model.User
	initializers.DB.Delete(&user, userid)
	c.JSON(http.StatusOK, user)
}
func GetAllpublicAccounts(c *gin.Context) {
	type Body struct {
		Admin    string `json:"admin"`
		Password string `json:"password"`
	}
	var req Body
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	if req.Admin != "admin" || req.Password != "adminPassword" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var users []model.User
	if err := initializers.DB.Where("public = ?", true).Find(&users).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}
	c.JSON(http.StatusOK, users)
}
