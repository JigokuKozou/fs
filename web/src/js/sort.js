import fsClient from './fs_client.js'

// Кнопка размера и стрелка сортировки
const size = {
    button: document.querySelector('thead .dir_table__size'),
    arrow: null
}
size.arrow = size.button?.querySelector('.arrow')

let _type
setType(fsClient.SortOrder.DESC)

// Переключает тип сортировки
function toggleType() {
    setType(_type === fsClient.SortOrder.ASC ? 
        fsClient.SortOrder.DESC : fsClient.SortOrder.ASC)
}

function type() {
    return _type
}

// Устанавливает тип сортировки и обновляет стрелку сортировки
// Принимает тип сортировки (fsClient.SortOrder.ASC или fsClient.SortOrder.DESC)
function setType(newType) {
    switch (newType) {
        case fsClient.SortOrder.DESC:
            size.arrow.classList.add('rotate')
            break;
        case fsClient.SortOrder.ASC:
            size.arrow.classList.remove('rotate')
            break;
        default:
            throw new Error("Тип сортировки не распознан")
    }

    _type = newType
}

export default { size, toggleType, setType, type }