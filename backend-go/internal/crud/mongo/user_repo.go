package mongo

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	repo "github.com/shelcia/mocker/backend-go/internal/crud"
)

type userRepo struct{ c *Client }

func NewUserRepository(c *Client) repo.UserRepository { return &userRepo{c} }

func (r *userRepo) FindByID(ctx context.Context, id string) (*repo.User, error) {
	oid, err := primitive.ObjectIDFromHex(id); if err != nil { return nil, err }
	var u repo.User
	err = r.c.DB.Collection("users").FindOne(ctx, bson.M{"_id": oid}).Decode(&u)
	return &u, err
}