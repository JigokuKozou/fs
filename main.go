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

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Fatalln("Произошла непредвиденная ошибка:", r)
		}
	}()

	// Создаём контекст программы
	ctx := context.Background()

	// Передаём контекст серверу
	go server.Run(ctx)

	// Ожидание сигнала завершения работы
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	<-stop
	log.Print("Получен сигнал остановки сервера. Завершение работы...")

	// Завершение работы сервера
	if err := server.Shutdown(5 * time.Second); err != nil {
		log.Fatalf("Не удалось корректно завершить работу сервера: %v", err)
	}

	log.Println("Сервер остановлен")
}
