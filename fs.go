package main

import (
	"flag"
	"fmt"
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
	flag.StringVar(&rootPath, "root", "", "Путь до корневой директории")
	flag.Parse()

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
		size += info.Size()
		return nil
	})
	if err != nil {
		return 0, err // TODO fmt err
	}

	return size, nil
}

func printTableRootInfo(rootInfo []rootFileInfo) {
	fmt.Println(rootInfo)
}
