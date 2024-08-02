package server

import (
	"errors"
	"net/http"
	"os"

	fs "github.com/JigokuKozou/fs/internal/filesystem"
)

// Сообщения ошибки
const (
	MessageInteranalError    = "Внутренняя ошибка сервера"
	MessageDirectoryNotFound = "Директория не существует"
	MessagePermissionDenied  = "Нет доступа к директории"
	MessageUnknownSortType   = "Неизвестный тип сортировки"
)

// Response - структура, возвращаемая HTTP-сервером.
type Response struct {
	RootDir         string         `json:"rootDir"`         // Путь к корневой директории.
	Entities        []fs.DirEntity `json:"entities"`        // Список сущностей в корневой директории.
	LoadTimeSeconds float64        `json:"loadTimeSeconds"` // Время загрузки в секундах.
	ErrorCode       int            `json:"errorCode"`       // Код ошибки.
	ErrorMessage    string         `json:"errorMessage"`    // Сообщение об ошибке.
}

// NewResponse создает новый объект Response.
// Сообщение ошибки зависит от типа ошибки.
func NewResponse(rootPath string, err error) Response {
	var responseErr = Response{
		RootDir: rootPath,
	}

	if errors.Is(err, os.ErrNotExist) {
		responseErr.ErrorCode = http.StatusNotFound
		responseErr.ErrorMessage = MessageDirectoryNotFound
	} else if errors.Is(err, os.ErrPermission) {
		responseErr.ErrorCode = http.StatusForbidden
		responseErr.ErrorMessage = MessagePermissionDenied
	} else if _, ok := err.(fs.ErrUnknownSortType); ok {
		responseErr.ErrorCode = http.StatusBadRequest
		responseErr.ErrorMessage = MessageUnknownSortType
	} else {
		responseErr.ErrorCode = http.StatusInternalServerError
		responseErr.ErrorMessage = MessageInteranalError
	}

	return responseErr
}
