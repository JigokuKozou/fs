import dirTable from "./dirTable.js"
import fileManager from "./fileManager.js"

function initEventListeners() {

    // Кнопка назад вырезает последнюю директорию из пути и обновляет таблицу
    fileManager.backButton.addEventListener('click', function() {
        const splittedRootPath = fileManager.rootPathInput.value.split('/')
        splittedRootPath.pop()
        fileManager.changeRootPath(splittedRootPath.join('/'))

        fileManager.loadDirEntities()
    })

    // Кнопка размера меняет тип сортировки на противоположный и обновляет таблицу
    dirTable.sizeButton.addEventListener('click', function() {
        dirTable.toggleSortType()
        fileManager.loadDirEntities()
    })
}

export default initEventListeners