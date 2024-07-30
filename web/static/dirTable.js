import * as fsClient from './fs_client.js'

const DEFAULT_SORT_TYPE = fsClient.SortOrder.DESC

const sizeButton = document.querySelector('.dir_table__size .selectable_text');
const sizeArrow = document.querySelector('.arrow');

const dirEntitiesList = document.querySelector('.dir_table tbody');

let sortType

function setSortType(type) {
    sortType = type
    if (sortType === fsClient.SortOrder.DESC) {
        sizeArrow.classList.add('rotate')
    } else {
        sizeArrow.classList.remove('rotate')
    }
}

function toggleSortType() {
    setSortType(sortType === fsClient.SortOrder.ASC ? 
        fsClient.SortOrder.DESC : fsClient.SortOrder.ASC)
}

function init() {
    setSortType(DEFAULT_SORT_TYPE)
}

function loadDirEntities(path) {
    disableEventsWhileLoading()
    dirEntitiesList.innerHTML = ''

    return fsClient.fetchDirEntity(path, sortType)
    .then(dirEntities => renderDirEntities(dirEntities))
    .then(enableEventsAfterLoading)
    .catch(error => {
        enableEventsAfterLoading()
        alert(error)
    })
}

function renderDirEntities(dirEntities) {
    dirEntitiesList.innerHTML = ''
    dirEntities.forEach(dirEntity => {
        const row = document.createElement('tr')

        const typeCell = document.createElement('td')
        typeCell.textContent = dirEntity.type;
        row.appendChild(typeCell)

        const nameCell = document.createElement('td')
        nameCell.textContent = dirEntity.name;
        row.appendChild(nameCell)

        const sizeCell = document.createElement('td')
        sizeCell.textContent = dirEntity.size;
        sizeCell.classList.add('dir_table__size');
        row.appendChild(sizeCell)

        if (dirEntity.type === fsClient.DirEntityType.DIR) {
            row.classList.add('selectable')
        }
        dirEntitiesList.appendChild(row)
    });
}

function disableEventsWhileLoading() {
    sizeButton.style.pointerEvents = 'none'
    dirEntitiesList.style.pointerEvents = 'none'
}

function enableEventsAfterLoading() {
    sizeButton.style.pointerEvents = 'auto'
    dirEntitiesList.style.pointerEvents = 'auto'
}

export default { dirEntitiesList, sizeButton, init, setSortType, toggleSortType, loadDirEntities }