package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"slices"
)

type rootFileInfo struct {
	IsDir bool
	Name  string
	Size  int64
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
}

func parseFlag() (string, string, error) {
	var rootPath string
	var sort string
	flag.StringVar(&rootPath, "root", "", "Путь до корневой директории")
	flag.StringVar(&sort, "sort", "", "Тип сортировки по размеру (desc/asc)")
	flag.Parse()

	if rootPath == "" || sort == "" {
		flag.Usage()
		return "", "", fmt.Errorf("не указан путь до корневой директории или тип сортировки")
	}
	if sort != SortDesc && sort != SortAsc {
		return "", "", fmt.Errorf("неверное значение флага sort [sort=%s]", sort)
	}

	return rootPath, sort, nil
}

func getRootInfo(rootPath string) ([]rootFileInfo, error) {
	rootEntries, err := os.ReadDir(rootPath)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения корневой директории [rootPath=%s]: %w", rootPath, err)
	}

	rootInfo, err := getRootFilesInfo(rootPath, rootEntries)
	if err != nil {
		return nil, fmt.Errorf("ошибка получения информации о файлах корневой директории [rootPath=%s]: %w",
			rootPath, err)
	}

	return rootInfo, nil
}

func getRootFilesInfo(rootPath string, dirEntries []os.DirEntry) ([]rootFileInfo, error) {
	var filesInfo []rootFileInfo

	for _, dirEntry := range dirEntries {
		dirPath := filepath.Join(rootPath, dirEntry.Name())
		fileInfo, err := getRootFileInfo(dirPath, dirEntry)
		if err != nil {
			return nil, fmt.Errorf("не удалось получить информацию о файле [dirEntry=%v]: %w", dirEntry, err)
		}
		filesInfo = append(filesInfo, fileInfo)
	}

	return filesInfo, nil
}

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

		fileInfo.Size = size
	}

	return fileInfo, nil
}

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

func sortRootInfos(rootInfos []rootFileInfo, sortType string) error {
	var cmp func(a, b rootFileInfo) int

	if sortType == SortAsc {
		cmp = func(a, b rootFileInfo) int {
			return int(a.Size - b.Size)
		}
	} else if sortType == SortDesc {
		cmp = func(a, b rootFileInfo) int {
			return int(b.Size - a.Size)
		}
	} else {
		return fmt.Errorf("не известный тип сортировки [sortType=%s]", sortType)
	}

	slices.SortFunc(rootInfos, cmp)
	return nil
}

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
		typeName := TypeFile
		if rootInfo.IsDir {
			typeName = TypeDir
		}

		fmt.Printf(template, typeName, rootInfo.Name, getForamttedSize(rootInfo.Size))
	}
}

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
