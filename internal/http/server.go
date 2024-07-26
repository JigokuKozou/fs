package http

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/JigokuKozou/fs/internal/config"
	fs "github.com/JigokuKozou/fs/internal/filesystem"
)

func Run() {
	config, err := config.GetConfig()
	if err != nil {
		log.Fatalln(err)
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", config.ServerPort),
		Handler: http.DefaultServeMux,
	}

	http.HandleFunc("/fs", fsHandler)

	fmt.Printf("Запуск сервера на http://localhost:%s ...\n", config.ServerPort)
	err = server.ListenAndServe()
	if err != nil || errors.Is(err, http.ErrServerClosed) {
		log.Fatalln(err)
	}
}

// fsHandler обрабатывает HTTP-запросы для получения информации о содержимом директории.
func fsHandler(w http.ResponseWriter, r *http.Request) {
	rootPath, sortType, err := getRequestParams(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rootInfo, err := fs.GetSortedRootInfo(rootPath, sortType)
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
		if err, ok := err.(fs.ErrUnknownSortType); ok {
			http.Error(w, "неверный тип сортировки", http.StatusBadRequest)
			log.Println(err)
			return
		}

		http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)
		log.Println(err)
		return
	}

	jsonResponse, err := json.Marshal(*rootInfo)
	if err != nil {
		http.Error(w, "Внутренняя ошибка сервера", 500)
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
		err := fmt.Errorf("передан пустой параметр пути и/или сортировки [root=%s, sort=%s]",
			rootPath, sortType)
		return "", "", err
	}
	return rootPath, sortType, nil
}
