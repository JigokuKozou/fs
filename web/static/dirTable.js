import * as fsClient from './fs_client.js'

const DEFAULT_SORT_TYPE = fsClient.SortOrder.DESC

// Кнопка размера и стрелка сортировки
const sizeButton = document.querySelector('thead .dir_table__size');
const sizeArrow = document.querySelector('.arrow');

const dirEntitiesList = document.querySelector('.dir_table tbody');
const loadingScreen = document.querySelector('.loadingScreen');

let sortType

// Устанавливает тип сортировки и обновляет стрелку сортировки
// Принимает тип сортировки (fsClient.SortOrder.ASC или fsClient.SortOrder.DESC)
function setSortType(type) {
    sortType = type
    if (sortType === fsClient.SortOrder.DESC) {
        sizeArrow.classList.add('rotate')
    } else {
        sizeArrow.classList.remove('rotate')
    }
}

// Переключает тип сортировки
function toggleSortType() {
    setSortType(sortType === fsClient.SortOrder.ASC ? 
        fsClient.SortOrder.DESC : fsClient.SortOrder.ASC)
}

function init() {
    setSortType(DEFAULT_SORT_TYPE)
}

// Обновляет таблицу списка файлов и директорий
function loadDirEntities(path) {
    disableEventsWhileLoading()
    dirEntitiesList.innerHTML = ''
    showLoadingScreen()

    return fsClient.fetchDirEntity(path, sortType)
    .then(response => {
        console.log(response)
        if (response.entities === null || response.entities.length === 0) {
            showInfoPanel(response.error_message)
            return response
        }
        renderDirEntities(response.entities);
        return response
    })
    .catch(error => {
        alert(error.message);
    })
    .finally((response) => {
        hideLoadingScreen()
        enableEventsAfterLoading()

        return response
    })
}

// Создаёт и добавляет строки файлов и директорий в tbody на основе переданного массива
function renderDirEntities(dirEntities) {
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

// Отключает события обновляющие таблицу
function disableEventsWhileLoading() {
    sizeButton.style.pointerEvents = 'none'
    dirEntitiesList.style.pointerEvents = 'none'
}

// Включает события обновляющие таблицу
function enableEventsAfterLoading() {
    sizeButton.style.pointerEvents = 'auto'
    dirEntitiesList.style.pointerEvents = 'auto'
}

// Показать сообщение о загрузке
function showLoadingScreen() {
    dirEntitiesList.appendChild(loadingScreen);
}

// Скрыть сообщение о загрузке
function hideLoadingScreen() {
    dirEntitiesList.removeChild(loadingScreen);
}

function showInfoPanel(message) { 

    // TODO: Показать панель с информацией
    alert("Инфо панель: " + message)
}

export default { dirEntitiesList, sizeButton, init, setSortType, toggleSortType, loadDirEntities }