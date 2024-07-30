const SortOrder = {
    ASC: 'asc',
    DESC: 'desc'
}

const DirEntityType = {
    FILE: 'Файл',
    DIR: 'Дир'
}

// Запрос на получение информации о содержимом директории
function fetchDirEntity(rootPath, sortType) {
    rootPath = rootPath === undefined ? '' : rootPath
    const url = `/fs?root=${encodeURIComponent(rootPath)}&sort=${encodeURIComponent(sortType)}`;
    return fetch(url, { method: "GET" })
        .then(response => {
            if (response.status === 500) {
                throw new Error("Внутренняя ошибка сервера")
            }

            return response.json()
        })
}

export { SortOrder, DirEntityType, fetchDirEntity }
