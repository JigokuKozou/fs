const SortOrder = {
    ASC: 'asc',
    DESC: 'desc'
}

const DirEntityType = {
    FILE: 'Файл',
    DIR: 'Дир'
}

function fetchDirEntity(rootPath, sortType) {
    rootPath = rootPath === undefined ? '' : rootPath
    const url = `/fs?root=${encodeURIComponent(rootPath)}&sort=${encodeURIComponent(sortType)}`;
    return fetch(url, { method: "GET" })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json()
        })
        .then(data => data.map(item => ({ type: item.type, name: item.name, size: item.size })))
}

export { SortOrder, DirEntityType, fetchDirEntity }
