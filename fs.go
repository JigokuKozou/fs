package main

import (
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
	panic("unimplemented")
}

func getRootDirEntry(path string) ([]os.DirEntry, error) {
	panic("unimplemented")
}

func printTableDirEntries(dirEntry []os.DirEntry) {
	panic("unimplemented")
}
