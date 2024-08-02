package filesystem

import "fmt"

const (
	TypeFile = "Файл"
	TypeDir  = "Дир"
)

const (
	SortDesc = "desc"
	SortAsc  = "asc"
)

// base - основа для конвертации размера в байтах в другие единицы измерения (например, килобайты, мегабайты и т.д.).
const base = 1024
const kiloByte = base
const megaByte = base * kiloByte
const gigaByte = base * megaByte
const teraByte = base * gigaByte

const DefaultDirSize = 4 * kiloByte

// DirEntity - представление сущностей(файлов/директорий) директории
type DirEntity struct {
	IsDir         bool   `json:"isDir"`         // Является ли директорией
	Type          string `json:"type"`          // Тип
	Name          string `json:"name"`          // Имя
	Size          int64  `json:"size"`          // Размер в байтах
	FormattedSize string `json:"formattedSize"` // Форматированое для пользователя представление размера
}

func (d *DirEntity) SetSize(size int64) {
	d.Size = size
	d.FormattedSize = FormattedSize(size)
}

// ErrUnknownSortType - ошибка, возникающая при некорректном типе сортировки
type ErrUnknownSortType struct {
	invalidSortTypeValue string
}

func (e ErrUnknownSortType) Error() string {
	return fmt.Sprintf("не известный тип сортировки [sortType=%s]", e.invalidSortTypeValue)
}
