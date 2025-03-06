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
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
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
		i.PUT("/update/:id", controller.UpdatePics)
		i.DELETE("/delete/:id", controller.DeletePics)
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
