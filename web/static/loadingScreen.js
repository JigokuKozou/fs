const element = document.querySelector('.loadingScreen');


// Показать сообщение о загрузке внутри parent
function show(parent) {
    parent.appendChild(element);
}

// Скрыть сообщение о загрузке внутри parent
function hide(parent) {
    parent.removeChild(element);
}

export default { element, show, hide }