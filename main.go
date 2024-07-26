package main

import (
	"log"

	"github.com/JigokuKozou/fs/internal/http"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Fatalln("Произошла непредвиденная ошибка:", r)
		}
	}()

	http.Run()
}
