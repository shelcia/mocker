package config

import (
	"log"
	"os"
	"time"
)

type Config struct {
	Port        string
	MongoURI    string
	DBName      string
	JWTSecret   string
	Env         string
	ReadTimeout time.Duration
}

func FromEnv() *Config {
	c := &Config{
		Port:        get("PORT", "8080"),
		MongoURI:    must("MONGO_URI"),
		DBName:      get("MONGO_DB", "mocker"),
		JWTSecret:   must("JWT_SECRET"),
		Env:         get("ENV", "dev"),
		ReadTimeout: 15 * time.Second,
	}
	return c
}

func get(k, def string) string { if v := os.Getenv(k); v != "" { return v }; return def }
func must(k string) string     { v := os.Getenv(k); if v == "" { log.Fatalf("%s required", k) }; return v }
