package main

import (
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
)

type rootFileInfo struct {
	IsDir bool
	Name  string
	Size  int64
}

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Fatalln("Произошла непредвиденная ошибка:", r)
		}
	}()

	rootPath, err := parseFlag()
	if err != nil {
		log.Fatalln(err)
	}

	rootInfo, err := getRootInfo(rootPath)
	if err != nil {
		log.Fatalln(err)
	}

	printTableRootInfo(rootInfo)
}

func parseFlag() (string, error) {
	var rootPath string
	var sortType string
	flag.StringVar(&rootPath, "root", "", "Путь до корневой директории")
	flag.StringVar(&sortType, "sort", "", "Путь до корневой директории")
	flag.Parse()

	if rootPath == "" {
		return "", fmt.Errorf("флаг root не задан")
	}
	if rootPath == "" {
		return "", fmt.Errorf("флаг root не задан")
	}

	return rootPath, nil
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
			return nil, fmt.Errorf("неудалось получить информацию о файле [dirEntry=%v]: %w", dirEntry, err)
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
			return rootFileInfo{}, err // TODO fmt err
		}

		fileInfo.Size = size
	}

	return fileInfo, nil
}

func calculateDirSize(dirPath string) (int64, error) {
	var size int64
	err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Printf("неудалось получить информацию о файле [dirPath=%s]: %s\n", dirPath, err)
			if errors.Is(err, fs.ErrPermission) || errors.Is(err, fs.ErrNotExist) {
				return nil
			}

			return fmt.Errorf("неудалось получить информацию о файле [dirPath=%s]: %w", dirPath, err)
		}

		size += info.Size()
		return nil
	})
	if err != nil {
		return 0, fmt.Errorf("неудалось вычислить размер директории [dirPath=%s]: %w", dirPath, err)
	}

	return size, nil
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

	fmt.Println(template)
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
	const kiloByte = 1000
	const megaByte = 1000 * kiloByte
	const gigaByte = 1000 * megaByte
	const teraByte = 1000 * gigaByte

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

	return fmt.Sprintf("%d", bytes)
}
