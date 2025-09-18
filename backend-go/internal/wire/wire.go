//go:build wireinject
// +build wireinject

package wire

import (
	"github.com/google/wire"
	"github.com/shelcia/mocker/backend-go/internal/config"
	"github.com/shelcia/mocker/backend-go/internal/services"
	"github.com/shelcia/mocker/backend-go/internal/crud/mongo"
	repo "github.com/shelcia/mocker/backend-go/internal/crud"
)

type Container struct {
	Config      *config.Config
	UserService services.UserService
	RepoClient  *mongo.Client
}

func Init() (*Container, error) {
	wire.Build(
		config.FromEnv,
		provideMongoClient,
		provideUserRepo,
		services.NewUserService,
		wire.Struct(new(Container), "*"),
	)
	return nil, nil
}

func provideMongoClient(c *config.Config) (*mongo.Client, error) {
	return mongo.New(c.MongoURI, c.DBName)
}
func provideUserRepo(c *mongo.Client) repo.UserRepository { return mongo.NewUserRepository(c) }
