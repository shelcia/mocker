package graphql

import (
	"context"
	"github.com/shelcia/mocker/backend-go/internal/services"
	"github.com/shelcia/mocker/backend-go/internal/crud"
)

type Resolver struct {
	Users services.UserService
}

func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }

func (m *mutationResolver) Login(ctx context.Context, email string, password string) (*repository.User, error) {
	return m.Users.Login(ctx, email, password)
}
