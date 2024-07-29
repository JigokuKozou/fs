export default async function fetchDirEntity(rootPath, sortType) {
    const url = `/fs?root=${encodeURIComponent(rootPath)}&sort=${encodeURIComponent(sortType)}`;
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    return data.map(item => ({ type: item.type, name: item.name, size: item.size }));
}

