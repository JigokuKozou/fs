package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/JigokuKozou/fs/internal/config"
	fs "github.com/JigokuKozou/fs/internal/filesystem"
)

var Server *http.Server
var configServer config.Config

// Run запускает HTTP-сервер.
func Run() {

	var err error
	configServer, err = config.GetConfig()
	if err != nil {
		log.Fatalln(err)
	}

	Server = &http.Server{
		Addr:    fmt.Sprintf(":%s", configServer.ServerPort),
		Handler: http.DefaultServeMux,
	}

	http.Handle("/", http.FileServer(http.Dir("./web/dist")))

	http.HandleFunc("/fs", fsHandler)

	fmt.Printf("Запуск сервера на http://localhost:%s ...\n", configServer.ServerPort)
	if err = Server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalln(err)
	}
}

// Shutdown останавливает HTTP-сервер. Возвращает ошибку метода http.Server.Shutdown.
func Shutdown(ctx context.Context, timeout time.Duration) error {
	log.Println("Сервер останавливается...")

	// Контекст для ожидания закрытия соединений
	timeoutCtx, timeoutCancel := context.WithTimeout(ctx, timeout)
	defer timeoutCancel()

	err := Server.Shutdown(timeoutCtx)

	return err
}

// fsHandler обрабатывает HTTP-запросы для получения информации о содержимом директории.
func fsHandler(w http.ResponseWriter, r *http.Request) {
	// Устанавливаем заголовок ответа, указывая, что содержимое будет в формате JSON
	w.Header().Set("Content-Type", "application/json")

	rootPath, sortType, err := getRequestParams(r)
	if err != nil {
		var responseErr = Response{
			ErrorCode:    http.StatusBadRequest,
			ErrorMessage: err.Error(),
		}

		jsonResponseErr, err := json.Marshal(responseErr)
		if err != nil {
			http.Error(w, MessageInteranalError, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		w.WriteHeader(responseErr.ErrorCode)
		w.Write(jsonResponseErr)
		log.Println(err)
		return
	}

	rootDirEntities, err := fs.SortedDirEntities(rootPath, sortType)
	if err != nil {

		var responseErr = NewResponse(rootPath, err)

		jsonResponseErr, errJson := json.Marshal(responseErr)
		if errJson != nil {
			http.Error(w, MessageInteranalError, http.StatusInternalServerError)
			log.Println(errJson)
			return
		}

		w.WriteHeader(responseErr.ErrorCode)
		w.Write(jsonResponseErr)
		log.Println(err)
		return
	}

	response := Response{
		RootDir:  rootPath,
		Entities: rootDirEntities,
	}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, MessageInteranalError, http.StatusInternalServerError)
		log.Println(err)
		return
	}
	w.Write(jsonResponse)
}

// getRequestParams извлекает параметры "root" и "sort" из URL запроса.
// Если один из параметров отсутствует, возвращается ошибка с соответствующим сообщением.
// Возвращает значения параметров "root" и "sort", а также ошибку, если она возникла.
func getRequestParams(r *http.Request) (string, string, error) {
	requestUrlValues := r.URL.Query()
	rootPath := requestUrlValues.Get("root")
	sortType := requestUrlValues.Get("sort")

	if rootPath == "" {
		rootPath = configServer.DefaultRootPath
	}

	if sortType == "" {
		err := fmt.Errorf("передан пустой параметр сортировки [root=%s, sort=%s]",
			rootPath, sortType)
		return "", "", err
	}
	return rootPath, sortType, nil
}
