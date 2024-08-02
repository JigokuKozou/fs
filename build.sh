#!/bin/sh

echo "=================================="
echo "lamp: docker compose up"
docker compose -f docker-compose-lamp.yml up -d

echo "=================================="
echo "npm: Установка зависимостей"
npm install

echo "=================================="
echo "npm: Сборка проекта webpack"
npm run build

echo "=================================="
echo "go: Установка зависимостей"
go mod download

echo "=================================="
echo "go: Сборка"
go build

echo "=================================="
echo "Запуск ./fs"
./fs