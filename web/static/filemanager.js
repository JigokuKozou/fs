import fetchDirEntity from './fs_client.js'
import defaultRootPath from './defaultRootPath.js'

const SortOrder = {
    ASC: 'asc',
    DESC: 'desc'
}

const DirEntityType = {
    FILE: 'Файл',
    DIR: 'Дир'
}

const DEFAULT_SORT_TYPE = SortOrder.DESC
const DEFAULT_ROOT_PATH = defaultRootPath || '/home'

const backButton = document.getElementById('back-button')

const rootPathInput = document.getElementById('root-path')

const sizeButton = document.querySelector('.dir_table__size .selectable_text');
const sizeArrow = document.querySelector('.arrow');

const dirEntitiesList = document.querySelector('.dir_table tbody');

let sortType
 
function changeRootPath(path) {
    if (path.length == 0) {
        path = '/'
    }
    rootPathInput.value = path
}

function setSortType(type) {
    sortType = type
    if (sortType === SortOrder.DESC) {
        sizeArrow.classList.add('rotate')
    } else {
        sizeArrow.classList.remove('rotate')
    }
}

function toggleSortType() {
    setSortType(sortType === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC)
}

function init() {
    changeRootPath(DEFAULT_ROOT_PATH)
    setSortType(DEFAULT_SORT_TYPE)

    initEventListeners()

    fetchAndRenderDirEntities()
}

function initEventListeners() {
    sizeButton.addEventListener('click', function() {
        toggleSortType()
        fetchAndRenderDirEntities()
    })

    dirEntitiesList.addEventListener('click', function(event) {
        const tr = event.target.closest('tr')
        if (tr.classList.contains('selectable')) {
            const dirName = tr.querySelector('td:nth-child(2)').textContent
            if (rootPathInput.value === '/') {
                changeRootPath('/' + dirName)
            } else {
                changeRootPath(`${rootPathInput.value}/${dirName}`)
            }
            fetchAndRenderDirEntities()
        }
    })

    backButton.addEventListener('click', function() {
        const splittedRootPath = rootPathInput.value.split('/')
        splittedRootPath.pop()
        changeRootPath(splittedRootPath.join('/'))
        fetchAndRenderDirEntities()
    })
}

function fetchAndRenderDirEntities() {
    try {
        disableEventsWhileLoading()
        dirEntitiesList.innerHTML = ''

        const rootPath = rootPathInput.value
        fetchDirEntity(rootPath, sortType)
        .then(dirEntities => renderDirEntities(dirEntities))
        .then(enableEventsAfterLoading)
        .catch(error => console.error(error))
        
    } catch (error) {
        console.error(error)
    }
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

        if (dirEntity.type === DirEntityType.DIR) {
            row.classList.add('selectable')
        }
        dirEntitiesList.appendChild(row)
    });
}

const blockedElements = [backButton, sizeButton, dirEntitiesList]

function disableEventsWhileLoading() {
    blockedElements.forEach(element => element.style.pointerEvents = 'none')
}

function enableEventsAfterLoading() {
    blockedElements.forEach(element => element.style.pointerEvents = 'auto')
}

export default init