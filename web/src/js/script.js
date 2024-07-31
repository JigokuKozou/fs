import fm from './fileManager.js'
import initButtonEventListeners from './buttons.js'

document.addEventListener("DOMContentLoaded", function() {
    fm.init()
    initButtonEventListeners()
})
