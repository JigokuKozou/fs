package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"slices"
	"time"
)

// rootFileInfo - представление сущностей(файлов/директорий) корневой директории
type rootFileInfo struct {
	IsDir bool   // Является ли директорией
	Name  string // Имя
	Size  int64  // Размер в байтах
}

const (
	SortDesc = "desc"
	SortAsc  = "asc"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Fatalln("Произошла непредвиденная ошибка:", r)
		}
	}()

	start := time.Now()

	rootPath, sortType, err := parseFlag()
	if err != nil {
		log.Fatalln(err)
	}

	rootInfos, err := getRootInfo(rootPath)
	if err != nil {
		log.Fatalln(err)
	}

	if err := sortRootInfos(rootInfos, sortType); err != nil {
		log.Fatalln(err)
	}

	printTableRootInfo(rootInfos)

	log.Printf("Время выполнения %.2f сек", time.Since(start).Seconds())
}

// parseFlag - парсит флаги командной строки и возвращает путь до корневой директории и тип сортировки.
// Если флаги не указаны или имеют неверные значения, возвращается ошибка.
func parseFlag() (string, string, error) {
	var rootPath string
	var sort string
	flag.StringVar(&rootPath, "root", "", "Путь до корневой директории")
	flag.StringVar(&sort, "sort", "", "Тип сортировки по размеру (desc/asc)")
	flag.Parse()

	// Проверяем, указаны ли оба флага
	if rootPath == "" || sort == "" {
		flag.Usage()
		return "", "", fmt.Errorf("не указан путь до корневой директории или тип сортировки [rootPath=%s, sort=%s]",
			rootPath, sort)
	}

	// Проверяем, имеет ли флаг sort допустимое значение
	if sort != SortDesc && sort != SortAsc {
		return "", "", fmt.Errorf("неверное значение флага sort [sort=%s]", sort)
	}

	return rootPath, sort, nil
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
	var filesInfo []rootFileInfo

	for _, dirEntry := range dirEntries {
		dirPath := filepath.Join(rootPath, dirEntry.Name())
		fileInfo, err := getRootFileInfo(dirPath, dirEntry)
		if err != nil {
			fmt.Printf("Не удалось получить информацию о файле [dirEntry=%v]: %s", dirEntry, err)
			continue
		}
		filesInfo = append(filesInfo, fileInfo)
	}

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
		const defaultDirSize = 4000
		size, err := calculateDirSize(dirPath)
		if err != nil {
			return rootFileInfo{}, fmt.Errorf("не удалось вычислить размер директории [dirPath=%s]: %w", dirPath, err)
		}
		if size == 0 {
			size = defaultDirSize
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

// printTableRootInfo - выводит информацию о корневых файлах в табличном формате.
func printTableRootInfo(rootInfos []rootFileInfo) {
	const (
		columnType = "Тип"
		columnName = "Имя"
		columnSize = "Размер"
	)

	const (
		TypeFile = "Файл"
		TypeDir  = "Дир"
	)

	maxNameLen := len(columnName)
	maxSizeLen := len(columnSize)
	for _, rootInfo := range rootInfos {
		if len(rootInfo.Name) > maxNameLen {
			maxNameLen = len(rootInfo.Name)
		}
		if len(getForamttedSize(rootInfo.Size)) > maxSizeLen {
			maxSizeLen = len(getForamttedSize(rootInfo.Size))
		}
	}

	template := fmt.Sprintf("%%-s\t%%-%ds\t%%%ds\n", maxNameLen, maxSizeLen)

	fmt.Printf(template, columnType, columnName, columnSize)
	for _, rootInfo := range rootInfos {
		var typeName string
		if rootInfo.IsDir {
			typeName = TypeDir
		} else {
			typeName = TypeFile
		}

		fmt.Printf(template, typeName, rootInfo.Name, getForamttedSize(rootInfo.Size))
	}
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
		return fmt.Sprintf("%dTb", bytes/teraByte)
	}
	if bytes > gigaByte {
		return fmt.Sprintf("%dGb", bytes/gigaByte)
	}
	if bytes > megaByte {
		return fmt.Sprintf("%dMb", bytes/megaByte)
	}
	if bytes > kiloByte {
		return fmt.Sprintf("%dKb", bytes/kiloByte)
	}

	return fmt.Sprintf("%db", bytes)
}
