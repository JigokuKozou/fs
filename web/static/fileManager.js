import dirTable from './dirTable.js'

const DEFAULT_ROOT_PATH = ""

const backButton = document.getElementById('back-button')

const rootPathInput = document.getElementById('root-path')

// Изменяет корневой путь в input
function changeRootPath(path) {
    if (path.length == 0) {
        path = '/'
    }

    rootPathInput.value = path
}

function init() {
    dirTable.init()

    initEventListeners()

    loadDirEntities()
}

function initEventListeners() {

    // Переходим переходит меняет путь до выбранной директории и обновляет таблицу
    dirTable.dirEntitiesList.addEventListener('click', function(event) {
        const tr = event.target.closest('tr')
        if (tr.classList.contains('selectable')) {
            const dirName = tr.querySelector('td:nth-child(2)').textContent
            if (rootPathInput.value === '/') {
                changeRootPath('/' + dirName)
            } else {
                changeRootPath(`${rootPathInput.value}/${dirName}`)
            }
            
            loadDirEntities()
        }
    })
}

// Обновление таблицы с блокировкой событий обновления
function loadDirEntities() {
    disableEventsWhileLoading()

    dirTable.loadDirEntities(rootPathInput.value)
    .then(response => changeRootPath(response.rootDir))
    .then(enableEventsAfterLoading)
    .catch(error => {
        enableEventsAfterLoading()
        alert(error)
    })
}

// Отключает события обновляющие таблицу
function disableEventsWhileLoading() {
    backButton.style.pointerEvents = 'none'
}

// Включает события обновляющие таблицу
function enableEventsAfterLoading() {
    backButton.style.pointerEvents = 'auto'
}

export default { rootPathInput, backButton, init, loadDirEntities, changeRootPath }