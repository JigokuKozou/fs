import fileManager from "./fileManager.js"
import sort from "./sort.js"

function initEventListeners() {

    // Кнопка назад вырезает последнюю директорию из пути и обновляет таблицу
    fileManager.backButton.addEventListener('click', function() {
        const splittedRootPath = fileManager.rootPathInput.value.split('/')
        splittedRootPath.pop()
        fileManager.changeRootPath(splittedRootPath.join('/'))

        fileManager.loadDirEntities()
    })

    // Кнопка размера меняет тип сортировки на противоположный и обновляет таблицу
    sort.size.button.addEventListener('click', function() {
        sort.toggleType()
        fileManager.loadDirEntities()
    })
}

export default initEventListeners