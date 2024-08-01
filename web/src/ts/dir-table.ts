import { FsClient, DirEntityType, FsClientResponse, DirEntity } from './fs-client'
import TableInfo from './table-info'
import Sort from './sort'

const LOADING_MESSAGE = 'Загрузка...'

// Класс представляющий таблицу списка файлов и директорий
export default class DitTable {
    public readonly fsClient: FsClient = new FsClient()
    public readonly sort: Sort = new Sort()

    // Секция таблицы в которой отображаются файлы и директории
    public readonly dirEntitiesList: HTMLTableSectionElement

    // Информационное сообщение внутри dirEntitiesList
    public readonly tableInfo: TableInfo

    constructor() {
        const tableBody: HTMLTableSectionElement | null = document.querySelector('.dir_table tbody')
        if (!tableBody) {
            throw new Error('Элемент .dir_table tbody не найден')
        }
        this.dirEntitiesList = tableBody

        this.tableInfo = new TableInfo(this.dirEntitiesList)
    }

    // Обновляет таблицу списка файлов и директорий
    public async loadDirEntities(path: string): Promise<FsClientResponse> {
        this.disableEventsWhileLoading()
        this.dirEntitiesList.innerHTML = ''
        this.tableInfo.show(LOADING_MESSAGE)

        try {
            const response = await this.fsClient.fetchDirEntity(path, this.sort.getType())
            console.log(response)
            if (response.entities == null || response.entities.length === 0) {
                this.tableInfo.show(response.error_message)
                return response
            }
            this.renderDirEntities(response.entities);

            this.tableInfo.hide()
            return response
        } finally {
            this.enableEventsAfterLoading()
        }
    }

    // Добавляет строки в dirEntitiesList с информацией о директориях и файлах
    private renderDirEntities(dirEntities: DirEntity[]): void {
        dirEntities.forEach((dirEntity: DirEntity) => {
            const row = document.createElement('tr');

            const typeCell = document.createElement('td');
            typeCell.textContent = dirEntity.type;
            row.appendChild(typeCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = dirEntity.name;
            row.appendChild(nameCell);

            const sizeCell = document.createElement('td');
            sizeCell.textContent = dirEntity.size;
            sizeCell.classList.add('dir_table__size');
            row.appendChild(sizeCell);

            if (dirEntity.type === DirEntityType.DIR) {
                row.classList.add('selectable');
            }

            this.dirEntitiesList.appendChild(row);
        });
    }

    // Отключает события обновляющие таблицу
    private disableEventsWhileLoading() {
        this.sort.size.button.style.pointerEvents = 'none'
        this.dirEntitiesList.style.pointerEvents = 'none'
    }

    // Включает события обновляющие таблицу
    private enableEventsAfterLoading() {
        this.sort.size.button.style.pointerEvents = 'auto'
        this.dirEntitiesList.style.pointerEvents = 'auto'
    }
}
