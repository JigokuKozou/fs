import fsClient from './fs_client.js'
import loadingScreen from './loadingScreen.js'
import sort from './sort.js'

const dirEntitiesList = document.querySelector('.dir_table tbody');

// Обновляет таблицу списка файлов и директорий
function loadDirEntities(path) {
    disableEventsWhileLoading()
    dirEntitiesList.innerHTML = ''
    loadingScreen.show(dirEntitiesList)

    return fsClient.fetchDirEntity(path, sort.type())
    .then(response => {
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
        loadingScreen.hide(dirEntitiesList)
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
    sort.size.button.style.pointerEvents = 'none'
    dirEntitiesList.style.pointerEvents = 'none'
}

// Включает события обновляющие таблицу
function enableEventsAfterLoading() {
    sort.size.button.style.pointerEvents = 'auto'
    dirEntitiesList.style.pointerEvents = 'auto'
}

function showInfoPanel(message) { 

    // TODO: Показать панель с информацией
    alert("Инфо панель: " + message)
}

export default { dirEntitiesList, loadDirEntities }