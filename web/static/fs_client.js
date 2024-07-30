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
            if (!response?.ok) {
                throw new Error(response.statusText);
            }
            return response.json()
        })
        .then(data => { 
            return {
                rootDir: data.root_dir, 
                entities: data.entities
            }
        })
}

export { SortOrder, DirEntityType, fetchDirEntity }
