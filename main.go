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

	go server.Run()

	// Канал для ожидания сигналов завершения работы
	stop := make(chan os.Signal, 4)

	// Ожидание сигнала SIGINT (Ctrl+C) для завершения работы
	// Приложение должно закрыться после нажатия Ctrl+C
	signal.Notify(stop, os.Interrupt)

	// Ожидание сигнала SIGTERM ( Terminate ) для завершения работы
	// Этот сигнал будет отправлен операционной системой при завершении процесса
	signal.Notify(stop, syscall.SIGTERM)

	// Ожидание сигнала SIGTSTP (stop with signal) для завершения работы
	// Этот сигнал будет отправлен операционной системой при нажатии комбинации клавиш Ctrl+Z
	signal.Notify(stop, syscall.SIGTSTP)

	// Ожидание сигнала SIGQUIT (quit) для завершения работы
	// Этот сигнал будет отправлен операционной системой при нажатии комбинации клавиш Ctrl+\
	signal.Notify(stop, syscall.SIGQUIT)

	<-stop
	log.Print("Получен сигнал остановки сервера. Завершение работы...")

	// Завершение работы сервера
	if err := server.Shutdown(context.Background(), 5*time.Second); err != nil {
		log.Fatalf("Не удалось корректно завершить работу сервера: %v", err)
	}

	log.Println("Сервер остановлен")
}
