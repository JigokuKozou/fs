package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/JigokuKozou/fs/internal/server"
)

// ServerTimeoutDuration - время ожидания завершения работы HTTP-сервера
const ServerTimeoutDuration = 10 * time.Second

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Fatalln("Произошла непредвиденная ошибка:", r)
		}
	}()

	// Канал для ожидания сигналов завершения работы
	signals := []os.Signal{os.Interrupt, syscall.SIGTERM, syscall.SIGTSTP, syscall.SIGQUIT}
	stop := make(chan os.Signal, len(signals))
	signal.Notify(stop, signals...)

	go func() {
		if err := server.Run(); err != nil {
			log.Fatalf("Не удалось запустить HTTP-сервер: %v", err)
		}
	}()

	<-stop
	log.Print("Получен сигнал остановки сервера. Завершение работы...")

	// Завершение работы сервера
	if err := server.Shutdown(context.Background(), ServerTimeoutDuration); err != nil {
		log.Fatalf("Не удалось корректно завершить работу сервера: %v", err)
	}

	log.Println("Сервер остановлен")
}
