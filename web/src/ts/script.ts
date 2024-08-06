import FileManager from './file-manager'
import DirTable from './dir-table'
import { ConfigStatistics } from './model'
import initButtonEventListeners from './buttons'

document.addEventListener("DOMContentLoaded", function() {

    const dirTable = new DirTable()
    const configStatistics = new ConfigStatistics()

    // Запускаем файловый менеджер
    const fm = new FileManager(dirTable, configStatistics)
    
    initButtonEventListeners(fm)

    fm.LoadDirEntities()
})
