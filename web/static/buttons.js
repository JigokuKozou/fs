import dirTable from "./dirTable.js"
import fileManager from "./fileManager.js"

function initEventListeners() {

    fileManager.backButton.addEventListener('click', function() {
        const splittedRootPath = fileManager.rootPathInput.value.split('/')
        splittedRootPath.pop()
        fileManager.changeRootPath(splittedRootPath.join('/'))

        fileManager.loadDirEntities()
    })

    dirTable.sizeButton.addEventListener('click', function() {
        dirTable.toggleSortType()
        fileManager.loadDirEntities()
    })
}

export default initEventListeners