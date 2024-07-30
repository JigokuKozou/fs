package config

import (
	"fmt"
	"os"
)

// Config - конфигурация приложения.
type Config struct {
	ServerPort      string // Порт сервера
	DefaultRootPath string // Путь по умолчанию
}

// getConfig - возвращает конфигурацию приложения,
// считывая значения из переменных окружения системы.
func GetConfig() (Config, error) {
	const (
		httpServerPort  = "HTTP_SERVER_PORT"
		defaultRootPath = "DEFAULT_ROOT_PATH"
	)
	port, ok := os.LookupEnv(httpServerPort)
	if !ok {
		return Config{}, fmt.Errorf("переменная окружения %s не задана",
			httpServerPort)
	}

	rootPath, ok := os.LookupEnv(defaultRootPath)
	if !ok {
		return Config{}, fmt.Errorf("переменная окружения %s не задана",
			defaultRootPath)
	}

	return Config{
		ServerPort:      port,
		DefaultRootPath: rootPath,
	}, nil
}
