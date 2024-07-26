package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Fatalln("Произошла непредвиденная ошибка:", r)
		}
	}()

	http.HandleFunc("/fs", fsHandler)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", "8080"),
		Handler: http.DefaultServeMux,
	}

	err := server.ListenAndServe()
	if err != nil || errors.Is(err, http.ErrServerClosed) {
		log.Fatalln(err)
	}
}

func fsHandler(w http.ResponseWriter, r *http.Request) {
	rootPath, sortType, err := getRequestParams(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rootInfo, err := GetSortedRootInfo(rootPath, sortType)

	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			http.Error(w, "Директория не существует", http.StatusNotFound)
			log.Println(err)
			return
		}
		if errors.Is(err, os.ErrPermission) {
			http.Error(w, "Нет доступа к директории", http.StatusForbidden)
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

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

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
