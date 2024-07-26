package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"slices"
	"sync"
	"time"
)

// rootFileInfo - представление сущностей(файлов/директорий) корневой директории
type rootFileInfo struct {
	IsDir bool   // Является ли директорией
	Name  string // Имя
	Size  int64  // Размер в байтах
}

// RootFileInfoResponse - форматированое для пользователя представление rootFileInfo
type RootFileInfoResponse struct {
	Type string `json:"type"` // Тип сущности (Файл/Дир)
	Name string `json:"name"` // Имя
	Size string `json:"size"` // Форматированный размер
}

// RootFileInfoResult - представляет собой структуру, содержащую информацию о файлах в корневом каталоге
// и время выполнения операции.
type RootFileInfoResult struct {
	ExecutionTime float64                `json:"execution_time"` // Время выполнения операции
	RootFiles     []RootFileInfoResponse `json:"root_files"`     // Информация о файлах директории
}

const (
	SortDesc = "desc"
	SortAsc  = "asc"
)

const DefaultDirSize = 4000

// GetSortedRootInfo получает информацию о файлах в указанном rootPath,
// сортирует их по заданному sortType и возвращает отсортированную информацию и время выполнения.
func GetSortedRootInfo(rootPath string, sortType string) (*RootFileInfoResult, error) {
	start := time.Now()

	rootInfos, err := getRootInfo(rootPath)
	if err != nil {
		return nil, err
	}

	if err := sortRootInfos(rootInfos, sortType); err != nil {
		return nil, err
	}

	end := time.Since(start).Seconds()
	log.Printf("Время выполнения %.2f сек", end)

	return &RootFileInfoResult{
		ExecutionTime: end,
		RootFiles:     getRootInfoJson(rootInfos),
	}, nil
}

// getRootInfo - получает информацию о файлах и директориях в корневой директории.
func getRootInfo(rootPath string) ([]rootFileInfo, error) {
	rootEntries, err := os.ReadDir(rootPath)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения корневой директории [rootPath=%s]: %w", rootPath, err)
	}

	rootInfo := getRootFilesInfo(rootPath, rootEntries)

	return rootInfo, nil
}

// getRootFilesInfo - получает информацию о файлах и директориях из списка os.DirEntry.
func getRootFilesInfo(rootPath string, dirEntries []os.DirEntry) []rootFileInfo {
	filesInfo := make([]rootFileInfo, len(dirEntries))
	var wg sync.WaitGroup
	wg.Add(len(dirEntries))

	for indexDir, dirEntry := range dirEntries {
		go func(rootPath string, i int, dirEntry os.DirEntry) {
			defer wg.Done()

			dirPath := filepath.Join(rootPath, dirEntry.Name())
			fileInfo, err := getRootFileInfo(dirPath, dirEntry)
			if err != nil {
				fmt.Printf("Не удалось получить информацию о файле [dirEntry=%v]: %ss", dirEntry, err)
				fileInfo = rootFileInfo{
					IsDir: dirEntry.IsDir(),
					Name:  dirEntry.Name(),
					Size:  0,
				}
				if fileInfo.IsDir {
					fileInfo.Size = DefaultDirSize
				}
			}
			filesInfo[i] = fileInfo
		}(rootPath, indexDir, dirEntry)
	}

	wg.Wait()
	return filesInfo
}

// getRootFileInfo - получает информацию о конкретном файле или директории.
func getRootFileInfo(dirPath string, dirEntry os.DirEntry) (rootFileInfo, error) {
	info, err := dirEntry.Info()
	if err != nil {
		return rootFileInfo{}, fmt.Errorf("не удалось получить информацию о файле [dirEntry=%v]: %w", dirEntry, err)
	}

	fileInfo := rootFileInfo{
		IsDir: info.IsDir(),
		Name:  info.Name(),
		Size:  info.Size(),
	}

	if fileInfo.IsDir {
		size, err := calculateDirSize(dirPath)
		if err != nil {
			return rootFileInfo{}, fmt.Errorf("не удалось вычислить размер директории [dirPath=%s]: %w", dirPath, err)
		}
		if size == 0 {
			size = DefaultDirSize
		}

		fileInfo.Size = size
	}

	return fileInfo, nil
}

// calculateDirSize - вычисляет размер директории, рекурсивно проходя по всем её файлам и поддиректориям.
func calculateDirSize(dirPath string) (int64, error) {
	var size int64
	err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Printf("не удалось получить информацию о файле [dirPath=%s]: %s\n", path, err)

			return nil
		}

		size += info.Size()
		return nil
	})
	if err != nil {
		return 0, fmt.Errorf("не удалось вычислить размер директории [dirPath=%s]: %w", dirPath, err)
	}

	return size, nil
}

// sortRootInfos - сортирует срез rootFileInfo в зависимости от типа сортировки sortType.
// Параметр sortType - строка, определяющая тип сортировки ("asc" для сортировки по возрастанию, "desc" для сортировки по убыванию).
// Возвращает ошибку, если тип сортировки не распознан.
func sortRootInfos(rootInfos []rootFileInfo, sortType string) error {
	var cmp func(a, b rootFileInfo) int

	switch sortType {
	case SortAsc:
		cmp = func(a, b rootFileInfo) int {
			return int(a.Size - b.Size)
		}
	case SortDesc:
		cmp = func(a, b rootFileInfo) int {
			return int(b.Size - a.Size)
		}
	default:
		return fmt.Errorf("не известный тип сортировки [sortType=%s]", sortType)
	}

	slices.SortFunc(rootInfos, cmp)
	return nil
}

// getRootInfoJson - возвращает слайс структур для вывода пользователю
func getRootInfoJson(rootInfos []rootFileInfo) []RootFileInfoResponse {
	const (
		TypeFile = "Файл"
		TypeDir  = "Дир"
	)

	rootFileInfoResponse := make([]RootFileInfoResponse, len(rootInfos))
	for index, rootInfo := range rootInfos {
		var typeName string
		if rootInfo.IsDir {
			typeName = TypeDir
		} else {
			typeName = TypeFile
		}

		rootFileInfoResponse[index] = RootFileInfoResponse{
			Type: typeName,
			Name: rootInfo.Name,
			Size: getForamttedSize(rootInfo.Size),
		}
	}

	return rootFileInfoResponse
}

// getForamttedSize - принимает размер в байтах и возвращает строку, представляющую этот размер
// в удобочитаемом формате (байты, килобайты, мегабайты, гигабайты или терабайты).
// Например, 1500 байт будет преобразовано в "1Kb".
func getForamttedSize(bytes int64) string {
	const base = 1000
	const kiloByte = base
	const megaByte = base * kiloByte
	const gigaByte = base * megaByte
	const teraByte = base * gigaByte

	if bytes > teraByte {
		return fmt.Sprintf("%d Tb", bytes/teraByte)
	}
	if bytes > gigaByte {
		return fmt.Sprintf("%d Gb", bytes/gigaByte)
	}
	if bytes > megaByte {
		return fmt.Sprintf("%d Mb", bytes/megaByte)
	}
	if bytes > kiloByte {
		return fmt.Sprintf("%d Kb", bytes/kiloByte)
	}

	return fmt.Sprintf("%d b", bytes)
}
