package controller

import (
	"awesomeProject1/initializers"
	"awesomeProject1/ml"
	"awesomeProject1/model"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// AddEmotion dodaje nowy wpis o emocjach
func AddEmotion(c *gin.Context) {
	userId := c.MustGet("userID").(int16)

	var emotion model.Emotions
	if err := c.ShouldBindJSON(&emotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nieprawidłowe dane",
		})
		return
	}

	emotion.UserID = userId

	// Walidacja danych
	if emotion.Feel == "" || emotion.Workout == "" || emotion.WorkoutTime == "" || emotion.Moon == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Wszystkie pola są wymagane",
		})
		return
	}

	if result := initializers.DB.Create(&emotion); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się zapisać emocji",
		})
		return
	}

	c.JSON(http.StatusOK, emotion)
}

// GetMyEmotions zwraca wszystkie emocje zalogowanego użytkownika
func GetMyEmotions(c *gin.Context) {
	userId := c.MustGet("userID").(int16)
	var emotions []model.Emotions

	if result := initializers.DB.Where("user_id = ?", userId).Find(&emotions); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się pobrać emocji",
		})
		return
	}

	c.JSON(http.StatusOK, emotions)
}

// UpdateEmotion aktualizuje wpis o emocjach
func UpdateEmotion(c *gin.Context) {
	userId := c.MustGet("userID").(int16)
	emotionId := c.Param("id")

	var emotion model.Emotions
	if err := initializers.DB.First(&emotion, emotionId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Nie znaleziono wpisu",
		})
		return
	}

	if emotion.UserID != userId {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Brak uprawnień",
		})
		return
	}

	var updateData model.Emotions
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nieprawidłowe dane",
		})
		return
	}

	emotion.Feel = updateData.Feel
	emotion.Workout = updateData.Workout
	emotion.WorkoutTime = updateData.WorkoutTime
	emotion.Moon = updateData.Moon

	if result := initializers.DB.Save(&emotion); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się zaktualizować wpisu",
		})
		return
	}

	c.JSON(http.StatusOK, emotion)
}

// DeleteEmotion usuwa wpis o emocjach
func DeleteEmotion(c *gin.Context) {
	userId := c.MustGet("userID").(int16)
	emotionId := c.Param("id")

	var emotion model.Emotions
	if err := initializers.DB.First(&emotion, emotionId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Nie znaleziono wpisu",
		})
		return
	}

	if emotion.UserID != userId {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Brak uprawnień",
		})
		return
	}

	if result := initializers.DB.Delete(&emotion); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się usunąć wpisu",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Wpis został usunięty",
	})
}

// GetEmotionAnalysis zwraca analizę emocji i sugestie
func GetEmotionAnalysis(c *gin.Context) {
	userId := c.MustGet("userID").(int16)
	var emotions []model.Emotions

	// Pobierz ostatnie wpisy
	if result := initializers.DB.Where("user_id = ?", userId).
		Order("id desc").
		Limit(10).
		Find(&emotions); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się pobrać danych do analizy",
		})
		return
	}

	// Tutaj będzie implementacja ML
	// Na razie zwróćmy proste sugestie
	suggestions := analyzeEmotions(emotions)

	c.JSON(http.StatusOK, gin.H{
		"analysis": suggestions,
	})
}
func analyzeEmotions(emotions []model.Emotions) map[string]interface{} {
	analysis := make(map[string]interface{})

	if len(emotions) < 2 {
		analysis["status"] = "Za mało danych do analizy"
		return analysis
	}

	// Przygotowanie danych do predykcji
	lastEmotion := emotions[0] // Zakładając, że sortujemy desc
	lastFeel, _ := strconv.ParseFloat(lastEmotion.Feel, 64)
	lastWorkoutTime, _ := strconv.ParseFloat(lastEmotion.WorkoutTime, 64)

	// Określenie intensywności treningu
	var workoutIntensity float64
	switch lastEmotion.Workout {
	case "very high":
		workoutIntensity = 1.0
	case "high":
		workoutIntensity = 0.8
	case "medium":
		workoutIntensity = 0.6
	case "low":
		workoutIntensity = 0.3
	default:
		workoutIntensity = 0.0
	}

	predictedMood := ml.PredictMood(lastWorkoutTime, workoutIntensity, lastFeel)

	analysis["predicted_mood"] = fmt.Sprintf("%.1f", predictedMood)
	analysis["confidence"] = "medium"

	// Inteligentna rekomendacja
	recommendation := "Utrzymuj obecny poziom aktywności"
	if predictedMood < lastFeel {
		recommendation = "Zalecane zwiększenie aktywności fizycznej"
	}
	analysis["recommendation"] = recommendation

	return analysis
}

// Funkcja pomocnicza do określania pewności predykcji
func determinePredictionConfidence(emotions []model.Emotions) string {
	if len(emotions) < 5 {
		return "low"
	} else if len(emotions) < 10 {
		return "medium"
	}
	return "high"
}

// Funkcja pomocnicza do analizy trendu
func analyzeTrend(emotions []model.Emotions) string {
	if len(emotions) < 3 {
		return "Za mało danych do określenia trendu"
	}

	// Analiza ostatnich 3 wpisów
	var lastMoods []float64
	for i := len(emotions) - 3; i < len(emotions); i++ {
		feel, _ := strconv.ParseFloat(emotions[i].Feel, 64)
		lastMoods = append(lastMoods, feel)
	}

	if lastMoods[2] > lastMoods[0] {
		return "Rosnący"
	} else if lastMoods[2] < lastMoods[0] {
		return "Malejący"
	}
	return "Stabilny"
}
