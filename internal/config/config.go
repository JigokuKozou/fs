package config

import (
	"fmt"
	"os"
)

// Config - конфигурация приложения.
type Config struct {
	ServerPort         string // Порт сервера
	DefaultRootPath    string // Путь по умолчанию
	ApacheHost         string // Хост Apache
	ApachePort         string // Порт Apache
	ApachePathPostStat string // Путь для отправки статистики
}

// getConfig - возвращает конфигурацию приложения,
// считывая значения из переменных окружения системы.
func GetConfig() (Config, error) {
	const (
		envHttpServerPort     = "HTTP_SERVER_PORT"
		envDefaultRootPath    = "DEFAULT_ROOT_PATH"
		envApacheHost         = "APACHE_HOST"
		envApachePort         = "APACHE_PORT"
		envApachePathPostStat = "APACHE_PATH_POST_STAT"
	)
	port, ok := os.LookupEnv(envHttpServerPort)
	if !ok {
		return Config{}, getErrNotDefinedEnv(envHttpServerPort)
	}

	rootPath, ok := os.LookupEnv(envDefaultRootPath)
	if !ok {
		return Config{}, getErrNotDefinedEnv(envDefaultRootPath)
	}

	apacheHost, ok := os.LookupEnv(envApacheHost)
	if !ok {
		return Config{}, getErrNotDefinedEnv(envApacheHost)
	}

	apachePort, ok := os.LookupEnv(envApachePort)
	if !ok {
		return Config{}, getErrNotDefinedEnv(envApachePort)
	}

	apachePathPostStat, ok := os.LookupEnv(envApachePathPostStat)
	if !ok {
		return Config{}, getErrNotDefinedEnv(envApachePathPostStat)
	}

	return Config{
		ServerPort:         port,
		DefaultRootPath:    rootPath,
		ApacheHost:         apacheHost,
		ApachePort:         apachePort,
		ApachePathPostStat: apachePathPostStat,
	}, nil
}

func getErrNotDefinedEnv(key string) error {
	return fmt.Errorf("переменная окружения %s не задана", key)
}
