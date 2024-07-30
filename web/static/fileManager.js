import dirTable from './dirTable.js'

const DEFAULT_ROOT_PATH = ""

const backButton = document.getElementById('back-button')

const rootPathInput = document.getElementById('root-path')
 
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

function loadDirEntities() {
    disableEventsWhileLoading()
    dirTable.loadDirEntities(rootPathInput.value)
    .then(enableEventsAfterLoading)
    .catch(error => {
        enableEventsAfterLoading()
        alert(error)
    })
}

function disableEventsWhileLoading() {
    backButton.style.pointerEvents = 'none'
}

function enableEventsAfterLoading() {
    backButton.style.pointerEvents = 'auto'
}

export default { rootPathInput, backButton, init, loadDirEntities, changeRootPath }