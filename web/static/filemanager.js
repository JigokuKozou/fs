import fetchDirEntity from './fs_client.js'

const SortOrder = {
    ASC: 'asc',
    DESC: 'desc'
}

const DirEntityType = {
    FILE: 'Файл',
    DIR: 'Дир'
}

const DIR_ENTRY_NAME = 'name'
const DIR_ENTRY_TYPE = 'type'
const DIR_ENTRY_SIZE = 'size'

const DEFAULT_ROOT_PATH = '/home/ilya'
const DEFAULT_SORT_TYPE = SortOrder.DESC

const backButton = document.getElementById('back-button')

const rootPathInput = document.getElementById('root-path')

const sizeButton = document.querySelector('.dir_table__size .selectable_text');
const sizeArrow = document.querySelector('.arrow');

const dirEntitiesList = document.querySelector('.dir_table tbody');

let rootPath, sortType
let dirEntities
 
function changeRootPath(path) {
    if (path.length == 0) {
        path = '/'
    }

    rootPath = path
    rootPathInput.value = rootPath
}

function setSortType(type) {
    sortType = type
    if (sortType === SortOrder.ASC) {
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
            if (rootPath === '/') {
                changeRootPath('/' + dirName)
            } else {
                changeRootPath(`${rootPath}/${dirName}`)
            }
            fetchAndRenderDirEntities()
        }
    })

    backButton.addEventListener('click', function() {
        const splittedRootPath = rootPath.split('/')
        splittedRootPath.pop()
        changeRootPath(splittedRootPath.join('/'))
        fetchAndRenderDirEntities()
    })
}

async function fetchAndRenderDirEntities() {
    try {
        dirEntities = await fetchDirEntity(rootPath, sortType)

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
            row.appendChild(sizeCell)

            if (dirEntity.type === DirEntityType.DIR) {
                row.classList.add('selectable')
            }
            dirEntitiesList.appendChild(row)
        });
    } catch (error) {
        console.error(error)
    }
}

export default init