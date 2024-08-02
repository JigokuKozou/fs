import FileManager from './file-manager'
import DitTable from './dir-table'
import { StatisticsClient } from './statistics-client'
import initButtonEventListeners from './buttons'

document.addEventListener("DOMContentLoaded", function() {

    const dirTable = new DitTable()
    const statisticClient = new StatisticsClient()

    // Запускаем файловый менеджер
    const fm = new FileManager(dirTable, statisticClient)
    
    initButtonEventListeners(fm)

    fm.LoadDirEntities()
})
