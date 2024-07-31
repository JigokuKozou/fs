import FileManager from "./file-manager"

export default function initButtonEventListeners(fm: FileManager) {
    // Кнопка назад вырезает последнюю директорию из пути и обновляет таблицу
    fm.backButton.addEventListener('click', function() {
        const splittedRootPath = fm.rootPathInput.value.split('/')
        splittedRootPath.pop()
        fm.changeRootPath(splittedRootPath.join('/'))

        fm.loadDirEntities()
    })

    const sort = fm.dirTable.sort
    // Кнопка размера меняет тип сортировки на противоположный и обновляет таблицу
    sort.size.button.addEventListener('click', function() {
        sort.toggleType()
        fm.loadDirEntities()
    })
}
