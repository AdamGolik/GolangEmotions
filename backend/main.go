package main

import (
	"awesomeProject1/auth"
	"awesomeProject1/controller"
	"awesomeProject1/initializers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	//load env
	initializers.LoadEnv()
	//connect to the db
	initializers.ConnectDB()
	//create tables
	initializers.CreateTables()
}

func main() {
	r := gin.Default()
	r.Static("/uploads", "./uploads")
	  // Middleware do autoryzacji dostępu do zdjęć
        r.Use(func(c *gin.Context) {
            if strings.HasPrefix(c.Request.URL.Path, "/uploads/") {
                token := c.Request.Header.Get("Authorization")
                if token == "" {
                    token = c.Query("token")
                }

                if token == "" {
                    c.AbortWithStatus(http.StatusUnauthorized)
                    return
                }
                // Tu możesz dodać właściwą weryfikację tokenu
            }
            c.Next()
        })
r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000"}, // lub "*" jeśli chcesz zezwolić na wszystkie origin
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
}))
	r.POST("/register", controller.Register)
	r.POST("/login", controller.Login)
	r.GET("/public", controller.GetAllpublicAccounts)
	//all about account
	a := r.Group("/account")
	a.Use(auth.AuthHandler)
	{
		a.PUT("/update", controller.UpdateAccount)
		a.GET("/See", controller.GetAccount)
		a.DELETE("/delete", controller.DeleteAccount)
	}
	r.GET("/all", controller.SeeALLPics)
	i := r.Group("/img")
	i.Use(auth.AuthHandler)
	{
		i.GET("/my", controller.SeeMyPicsAll)
		i.POST("/add", controller.AddImg)
		i.PUT("/:id", func(c *gin.Context) {
        fmt.Printf("Otrzymano żądanie PUT dla ID: %s\n", c.Param("id"))
        controller.UpdatePics(c)
    })
		i.DELETE("/:id", controller.DeletePics)
	}
	// W funkcji main() dodaj:
	e := r.Group("/emotions")
	e.Use(auth.AuthHandler)
	{
		e.POST("/add", controller.AddEmotion)
		e.GET("/my", controller.GetMyEmotions)
		e.PUT("/update/:id", controller.UpdateEmotion)
		e.DELETE("/delete/:id", controller.DeleteEmotion)
		e.GET("/analysis", controller.GetEmotionAnalysis)
	}
	r.Run(":8080")
}
