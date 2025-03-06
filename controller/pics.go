package controller

import (
	"awesomeProject1/initializers"
	"awesomeProject1/model"
	"fmt"
	"github.com/gin-gonic/gin"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

// Stała określająca folder na przechowywanie zdjęć
const uploadPath = "uploads/pictures"
const maxFileSize = 5 << 20 // 5 MB
// init tworzy folder na zdjęcia jeśli nie istnieje
func init() {
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		panic(err)
	}
}

// AddImg dodaje nowe zdjęcie
func AddImg(c *gin.Context) {
	userid := c.MustGet("userID").(int16)

	// Pobierz plik
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nie przesłano pliku",
		})
		return
	}

	if !validateFileType(file) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Niedozwolony typ pliku. Akceptowane są tylko obrazy: JPEG, PNG i GIF",
		})
		return
	}

	// W funkcjach AddImg i UpdatePics:
	if file.Size > maxFileSize {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Plik jest za duży. Maksymalny rozmiar to 5MB",
		})
		return
	}
	// Generuj unikalną nazwę pliku
	fileName := fmt.Sprintf("%d_%s", userid, file.Filename)
	filePath := filepath.Join(uploadPath, fileName)

	// Zapisz plik
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się zapisać pliku",
		})
		return
	}

	// Zapisz informacje w bazie danych
	pic := model.Img{
		UserID: userid,
		Public: c.PostForm("public") == "true",
		Img:    fileName, // Dodaj to pole do struktury Img!
	}

	if result := initializers.DB.Create(&pic); result.Error != nil {
		// Usuń plik w przypadku błędu zapisu do bazy
		os.Remove(filePath)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się zapisać informacji o zdjęciu",
		})
		return
	}

	c.JSON(http.StatusCreated, pic)
}

// DeletePics usuwa zdjęcie
func DeletePics(c *gin.Context) {
	userid := c.MustGet("userID").(int16)

	picId := c.Param("id")
	var pic model.Img

	// Najpierw pobierz informacje o zdjęciu
	if err := initializers.DB.First(&pic, picId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Zdjęcie nie zostało znalezione",
		})
		return
	}

	// Sprawdź czy użytkownik jest właścicielem
	if pic.UserID != userid {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Brak uprawnień do usunięcia tego zdjęcia",
		})
		return
	}

	// Usuń plik
	filePath := filepath.Join(uploadPath, pic.Img)
	if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się usunąć pliku",
		})
		return
	}

	// Usuń wpis z bazy
	if err := initializers.DB.Delete(&pic).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się usunąć informacji o zdjęciu",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Zdjęcie zostało usunięte",
	})
}

// SeeMyPicsAll zwraca wszystkie zdjęcia zalogowanego użytkownika
func SeeMyPicsAll(c *gin.Context) {
	var pics []model.Img
	userId := c.MustGet("userID").(int16)
	result := initializers.DB.Where("user_id = ?", userId).Find(&pics)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się pobrać twoich zdjęć",
		})
		return
	}
	c.JSON(http.StatusOK, pics)
}
func UpdatePics(c *gin.Context) {
	userid := c.MustGet("userID").(int16)
	picId := c.Param("id")

	// Sprawdź czy zdjęcie istnieje i czy należy do użytkownika
	var existingPic model.Img
	if err := initializers.DB.First(&existingPic, picId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Zdjęcie nie zostało znalezione",
		})
		return
	}

	if existingPic.UserID != userid {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Brak uprawnień do modyfikacji tego zdjęcia",
		})
		return
	}

	// Usuń stary plik jeśli przesłano nowy
	// Pobierz plik
	// W funkcji UpdatePics zmień tę część:
	file, err := c.FormFile("file")
	if err != nil {
		// Jeśli nie przesłano pliku, sprawdź czy przesłano tylko status public
		public := c.PostForm("public")
		if public != "" {
			existingPic.Public = public == "true"
			if result := initializers.DB.Save(&existingPic); result.Error != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Nie udało się zaktualizować informacji o zdjęciu",
				})
				return
			}
			c.JSON(http.StatusOK, existingPic)
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nie przesłano pliku ani innych danych do aktualizacji",
		})
		return
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nie przesłano pliku",
		})
		return
	}

	if !validateFileType(file) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Niedozwolony typ pliku. Akceptowane są tylko obrazy: JPEG, PNG i GIF",
		})
		return
	}

	// W funkcjach AddImg i UpdatePics:
	if file.Size > maxFileSize {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Plik jest za duży. Maksymalny rozmiar to 5MB",
		})
		return
	}
	if err == nil {
		// Usuń stary plik
		oldFilePath := filepath.Join(uploadPath, existingPic.Img)
		os.Remove(oldFilePath)

		// Zapisz nowy plik
		fileName := fmt.Sprintf("%d_%s", userid, file.Filename)
		filePath := filepath.Join(uploadPath, fileName)

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Nie udało się zapisać pliku",
			})
			return
		}
		existingPic.Img = fileName
	}

	// Aktualizuj status publiczny jeśli podano
	if public := c.PostForm("public"); public != "" {
		existingPic.Public = public == "true"
	}

	if result := initializers.DB.Save(&existingPic); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się zaktualizować informacji o zdjęciu",
		})
		return
	}

	c.JSON(http.StatusOK, existingPic)
}

// SeeALLPics zwraca wszystkie publiczne zdjęcia
func SeeALLPics(c *gin.Context) {
	var pics []model.Img
	result := initializers.DB.Where("public = ?", true).Find(&pics)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Nie udało się pobrać zdjęć",
		})
		return
	}

	c.JSON(http.StatusOK, pics)

}
func validateFileType(file *multipart.FileHeader) bool {
	// Lista dozwolonych typów MIME
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/gif":  true,
	}

	// Sprawdź pierwsze kilka bajtów pliku
	src, err := file.Open()
	if err != nil {
		return false
	}
	defer src.Close()

	// Bufor na pierwsze 512 bajtów
	buffer := make([]byte, 512)
	_, err = src.Read(buffer)
	if err != nil {
		return false
	}

	// Sprawdź typ MIME
	contentType := http.DetectContentType(buffer)
	return allowedTypes[contentType]
}
