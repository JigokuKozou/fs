package filesystem

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"slices"
	"sync"
)

// NewDirEntity создает новый DirEntity с указанными свойствами.
func NewDirEntity(isDir bool, name string, size int64) DirEntity {
	var typeName string
	if isDir {
		typeName = TypeDir
	} else {
		typeName = TypeFile
	}

	return DirEntity{
		IsDir:         isDir,
		Type:          typeName,
		Name:          name,
		Size:          size,
		FormattedSize: FormattedSize(size),
	}
}

// SortedDirEntities получает информацию о сущностях в директории по пути rootPath,
// сортирует их по заданному sortType и возвращает отсортированную информацию.
func SortedDirEntities(rootPath string, sortType string) ([]DirEntity, error) {
	dirEntities, err := RootDirEntities(rootPath)
	if err != nil {
		return nil, err
	}

	if err := SortDirEntities(dirEntities, sortType); err != nil {
		return nil, err
	}

	return dirEntities, nil
}

// RootDirEntities - получает информацию о файлах и директориях в корневой директории.
func RootDirEntities(rootPath string) ([]DirEntity, error) {
	rootEntries, err := os.ReadDir(rootPath)
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения корневой директории [rootPath=%s]: %w", rootPath, err)
	}

	rootDirEntities := make([]DirEntity, len(rootEntries))
	var wg sync.WaitGroup
	wg.Add(len(rootEntries))

	for indexDir, dirEntry := range rootEntries {
		go func(rootPath string, dirEntry os.DirEntry, wg *sync.WaitGroup, indexDir int) {
			defer wg.Done()

			dirPath := filepath.Join(rootPath, dirEntry.Name())
			dirEntity, err := mapToDirEntity(dirPath, dirEntry)
			if err != nil {
				fmt.Printf("Не удалось получить информацию о файле [dirEntry=%v]: %s", dirEntry, err)

				dirEntity = NewDirEntity(dirEntry.IsDir(), dirEntry.Name(), 0)
				if dirEntity.IsDir {
					dirEntity.SetSize(DefaultDirSize)
				}
			}
			rootDirEntities[indexDir] = dirEntity
		}(rootPath, dirEntry, &wg, indexDir)
	}

	wg.Wait()
	return rootDirEntities, nil
}

// mapToDirEntity - получает информацию о конкретном файле или директории.
func mapToDirEntity(dirPath string, dirEntry os.DirEntry) (DirEntity, error) {
	info, err := dirEntry.Info()
	if err != nil {
		return DirEntity{}, fmt.Errorf("не удалось получить информацию о файле [dirEntry=%v]: %w", dirEntry, err)
	}

	dirEntity := NewDirEntity(info.IsDir(), info.Name(), info.Size())

	if dirEntity.IsDir {
		size, err := CalculateDirSize(dirPath)
		if err != nil {
			return DirEntity{}, fmt.Errorf("не удалось вычислить размер директории [dirPath=%s]: %w", dirPath, err)
		}

		dirEntity.SetSize(size)
	}

	return dirEntity, nil
}

// CalculateDirSize - вычисляет размер директории, рекурсивно проходя по всем её файлам и поддиректориям.
func CalculateDirSize(dirPath string) (int64, error) {
	var size int64
	err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Printf("Не удалось получить информацию о файле [path=%s]: %s\n", path, err)

			return nil
		}

		if info.IsDir() {
			size += DefaultDirSize
		} else {
			size += info.Size()
		}
		return nil
	})
	if err != nil {
		return DefaultDirSize, fmt.Errorf("не удалось вычислить размер директории [dirPath=%s]: %w", dirPath, err)
	}
	// Выставляем размер пустой директории по умолчанию
	if size == 0 {
		size = DefaultDirSize
	}

	return size, nil
}

// SortDirEntities - сортирует срез rootFileInfo в зависимости от типа сортировки sortType.
// Параметр sortType - строка, определяющая тип сортировки ("asc" для сортировки по возрастанию, "desc" для сортировки по убыванию).
// Возвращает ошибку, если тип сортировки не распознан.
func SortDirEntities(rootInfos []DirEntity, sortType string) error {
	var cmp func(a, b DirEntity) int

	switch sortType {
	case SortAsc:
		cmp = func(a, b DirEntity) int {
			return int(a.Size - b.Size)
		}
	case SortDesc:
		cmp = func(a, b DirEntity) int {
			return int(b.Size - a.Size)
		}
	default:
		return ErrUnknownSortType{invalidSortTypeValue: sortType}
	}

	slices.SortFunc(rootInfos, cmp)
	return nil
}

// FormattedSize - принимает размер в байтах и возвращает строку, представляющую этот размер
// в удобочитаемом формате (байты, килобайты, мегабайты, гигабайты или терабайты).
// Например, 1500 байт будет преобразовано в "1Kb".
func FormattedSize(bytes int64) string {
	if bytes > teraByte {
		return fmt.Sprintf("%.2f TB", float64(bytes)/float64(teraByte))
	}
	if bytes > gigaByte {
		return fmt.Sprintf("%.2f GB", float64(bytes)/float64(gigaByte))
	}
	if bytes > megaByte {
		return fmt.Sprintf("%.2f MB", float64(bytes)/float64(megaByte))
	}
	if bytes > kiloByte {
		return fmt.Sprintf("%.2f KB", float64(bytes)/float64(kiloByte))
	}

	return fmt.Sprintf("%d B", bytes)
}
