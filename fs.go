package main

import (
	"flag"
	"fmt"
	"log"
	"os"
)

func main() {
	rootPath, err := parseFlag()
	if err != nil {
		log.Fatalln(err)
	}

	rootDirEntry, err := getRootDirEntry(rootPath)
	if err != nil {
		log.Fatalln(err)
	}

	printTableDirEntries(rootDirEntry)
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

func getRootDirEntry(path string) ([]os.DirEntry, error) {
	panic("unimplemented")
}

func printTableDirEntries(dirEntry []os.DirEntry) {
	panic("unimplemented")
}
