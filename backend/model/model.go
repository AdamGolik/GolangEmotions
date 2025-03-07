package model

type User struct {
	Id       int16      `gorm:"primaryKey" json:"id"`
	Email    string     `json:"email"`
	UserName string     `json:"user_name"`
	Password string     `json:"password"`
	Public   bool       `json:"public"`
	Emotions []Emotions `gorm:"foreignKey:UserID" json:"emotions"`
	Img      []Img      `gorm:"foreignKey:UserID" json:"img"`
}

type Emotions struct {
	Id     int16 `gorm:"primaryKey" json:"id"`
	UserID int16 `json:"user_id"`
	// 1-10
	Feel string `json:"feel"`
	// how much
	Workout string `json:"workout"`
	// how much hour
	WorkoutTime string `json:"workout_time"`
	// moon how it is is it bad good or somthing like that
	Moon string `json:"moon"`
}
type Img struct {
	Id     int16  `gorm:"primaryKey" json:"id"`
	UserID int16  `json:"user_id"`
	Img    string `json:"img"`
	Public bool   `json:"public"`
}
