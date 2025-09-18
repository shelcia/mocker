package crud

import "context"

type User struct {
	ID       string `bson:"_id,omitempty"`
	Email    string `bson:"email"`
	Name     string `bson:"name"`
	Password string `bson:"password,omitempty"`
}

type UserRepository interface {
	FindByID(ctx context.Context, id string) (*User, error)
}
