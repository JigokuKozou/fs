package config

import (
	"fmt"
	"os"
)

// Config - конфигурация приложения.
type Config struct {
	ServerPort string // Порт сервера
}

// getConfig - возвращает конфигурацию приложения,
// считывая значения из переменных окружения системы.
func GetConfig() (Config, error) {
	const (
		httpServerPort = "HTTP_SERVER_PORT"
	)
	port, ok := os.LookupEnv(httpServerPort)
	if !ok {
		return Config{}, fmt.Errorf("переменная окружения %s не задана",
			httpServerPort)
	}

	return Config{
		ServerPort: port,
	}, nil
}
