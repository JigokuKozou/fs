# Путь до файла Docker Compose
DOCKER_COMPOSE_FILE = ./docker/docker-compose.yml

# Путь до файла переменных окружения
ENV_FILE = .env

# Основная цель
run-all: up install build-npm go build-go run-go

# Цель для запуска Docker Compose
up:
	@echo "=================================="
	@echo "lamp: docker compose up"
	docker compose -f $(DOCKER_COMPOSE_FILE) --env-file $(ENV_FILE) up -d

# Цель для удаления контейнеров Docker Compose
down:
	@echo "=================================="
	@echo "lamp: docker compose down"
	docker compose -f $(DOCKER_COMPOSE_FILE) --env-file $(ENV_FILE) down

# Цель для установки зависимостей npm
install:
	@echo "=================================="
	@echo "npm: Установка зависимостей"
	npm install

# Цель для сборки проекта webpack
build-npm:
	@echo "=================================="
	@echo "npm: Сборка проекта webpack"
	npm run build

# Цель для установки зависимостей Go
go:
	@echo "=================================="
	@echo "go: Установка зависимостей"
	go mod download

# Цель для сборки Go проекта
build-go:
	@echo "=================================="
	@echo "go: Сборка"
	go build

# Цель для запуска исполняемого файла
run-go:
	@echo "=================================="
	@echo "Запуск ./fs"
	./fs

clear:
	rm -rf ./node_modules
	rm -rf ./web/dist
	rm ./fs