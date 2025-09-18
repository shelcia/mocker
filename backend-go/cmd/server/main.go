
package main

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	gen "github.com/shelcia/mocker/backend-go/internal/graphql/gql_generated/generated"
	"github.com/shelcia/mocker/backend-go/internal/graphql"
	"github.com/shelcia/mocker/backend-go/internal/services"
	"github.com/shelcia/mocker/backend-go/internal/crud"
)

func main() {
	// memory repo with a test user
	userRepo := repository.NewMemoryUserRepo()
	userService := services.NewUserService(userRepo)

	res := &graphql.Resolver{Users: userService}
	srv := handler.NewDefaultServer(gen.NewExecutableSchema(gen.Config{Resolvers: res}))

	http.Handle("/query", srv)
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))

	log.Println("server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
