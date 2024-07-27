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
	isDir         bool   // Является ли директорией
	Type          string `json:"type"` // Тип
	Name          string `json:"name"` // Имя
	size          int64  // Размер в байтах
	FormattedSize string `json:"size"` // форматированое для пользователя представление размера
}

func (d DirEntity) Size() int64 {
	return d.size
}

func (d *DirEntity) SetSize(size int64) {
	d.size = size
	d.FormattedSize = FormattedSize(size)
}

// ErrUnknownSortType - ошибка, возникающая при некорректном типе сортировки
type ErrUnknownSortType struct {
	invalidSortTypeValue string
}

func (e ErrUnknownSortType) Error() string {
	return fmt.Sprintf("не известный тип сортировки [sortType=%s]", e.invalidSortTypeValue)
}
