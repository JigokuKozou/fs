package main

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

// Config - конфигурация приложения.
type Config struct {
	ServerPort string // Порт сервера
}

func init() {
	// загружаем переменные .env в систему
	if err := LoadEnvironmentVar(); err != nil {
		log.Print("Файл .env не найден")
	}
}

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Fatalln("Произошла непредвиденная ошибка:", r)
		}
	}()

	config, err := getConfig()
	if err != nil {
		log.Fatalln(err)
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", config.ServerPort),
		Handler: http.DefaultServeMux,
	}

	http.HandleFunc("/fs", fsHandler)

	err = server.ListenAndServe()
	if err != nil || errors.Is(err, http.ErrServerClosed) {
		log.Fatalln(err)
	}
}

// LoadEnvironmentVar загружает переменные окружения из файла ".env".
func LoadEnvironmentVar() error {
	file, err := os.Open(".env")
	if err != nil {
		return fmt.Errorf("ошибка открытия файла .env: %w", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		// Пропуск пустых строк или коментариев
		if len(line) == 0 || strings.HasPrefix(line, "#") {
			continue
		}

		// Получения ключа и значения
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			return fmt.Errorf("неверный формат строки в .env файле: %s", line)
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		os.Setenv(key, value)
	}

	if err := scanner.Err(); err != nil {
		return fmt.Errorf("ошибка чтения файла .env: %v", err)
	}

	return nil
}

// getConfig - возвращает конфигурацию приложения,
// считывая значения из переменных окружения системы.
func getConfig() (Config, error) {
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

// fsHandler обрабатывает HTTP-запросы для получения информации о содержимом директории.
func fsHandler(w http.ResponseWriter, r *http.Request) {
	rootPath, sortType, err := getRequestParams(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rootInfo, err := GetSortedRootInfo(rootPath, sortType)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			http.Error(w, "директория не существует", http.StatusNotFound)
			log.Println(err)
			return
		}
		if errors.Is(err, os.ErrPermission) {
			http.Error(w, "нет доступа к директории", http.StatusForbidden)
			log.Println(err)
			return
		}
		if err, ok := err.(ErrUnknownSortType); ok {
			http.Error(w, "неверный тип сортировки", http.StatusBadRequest)
			log.Println(err)
			return
		}

		http.Error(w, "Внутреняя ошибка сервера", http.StatusInternalServerError)
		log.Println(err)
		return
	}

	jsonResponse, err := json.Marshal(*rootInfo)
	if err != nil {
		http.Error(w, "Внутреняя ошибка сервера", 500)
		log.Println(err)
		return
	}

	// Устанавливаем заголовок ответа, указывая, что содержимое будет в формате JSON
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

// getRequestParams извлекает параметры "root" и "sort" из URL запроса.
// Если один из параметров отсутствует, возвращается ошибка с соответствующим сообщением.
// Возвращает значения параметров "root" и "sort", а также ошибку, если она возникла.
func getRequestParams(r *http.Request) (string, string, error) {
	requestUrlValues := r.URL.Query()
	rootPath := requestUrlValues.Get("root")
	sortType := requestUrlValues.Get("sort")

	if rootPath == "" || sortType == "" {
		err := fmt.Errorf("переданы пустые параметры сортировки (поле и/или порядок)")
		return "", "", err
	}
	return rootPath, sortType, nil
}
