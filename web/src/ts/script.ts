import FileManager from './file-manager'
import DitTable from './dir-table'
import { ConfigStatistics } from './config-statistics'
import initButtonEventListeners from './buttons'

document.addEventListener("DOMContentLoaded", function() {

    const dirTable = new DitTable()
    const configStatistics = new ConfigStatistics()

    // Запускаем файловый менеджер
    const fm = new FileManager(dirTable, configStatistics)
    
    initButtonEventListeners(fm)

    fm.LoadDirEntities()
})
