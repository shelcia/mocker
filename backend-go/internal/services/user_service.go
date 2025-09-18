package services

import (
	"context"
	"errors"
	"github.com/shelcia/mocker/backend-go/internal/crud"
)

type UserService interface {
	Login(ctx context.Context, email, password string) (*repository.User, error)
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(r repository.UserRepository) UserService {
	return &userService{repo: r}
}

func (s *userService) Login(ctx context.Context, email, password string) (*repository.User, error) {
	u, _ := s.repo.FindByEmail(ctx, email)
	if u == nil {
		return nil, errors.New("email not found")
	}
	if u.Password != password {
		return nil, errors.New("invalid password")
	}
	return u, nil
}
