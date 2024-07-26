package config

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func init() {
	// загружаем переменные .env в систему
	if err := LoadEnvironmentVar(); err != nil {
		log.Print("Файл .env не найден")
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
