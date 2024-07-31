import FileManager from './file-manager'
import initButtonEventListeners from './buttons'

document.addEventListener("DOMContentLoaded", function() {
    // Запускаем файловый менеджер
    const fm = new FileManager()
    
    initButtonEventListeners(fm)
})
