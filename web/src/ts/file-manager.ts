import DirTable from './dir-table'
import { ConfigStatistics } from './config-statistics'


// Класс представляющий файловый менеджер, содержащий все элементы на странице
export default class FileManager {
    // Кнопка назад
    public readonly backButton: HTMLButtonElement

    // Кнопка статистики
    public readonly statisticsButton: HTMLElement

    // Поле ввода корневого пути
    public readonly rootPathInput: HTMLInputElement
    
    // Таблица содержания директории
    public readonly dirTable: DirTable

    // Таблица содержания директории
    public readonly configStatistics: ConfigStatistics

    constructor(dirTable : DirTable, configStatistics : ConfigStatistics) {
        this.dirTable = dirTable
        this.configStatistics = configStatistics

        const backButton: HTMLElement | null = document.getElementById('back-button')
        if (!backButton) {
            throw new Error('Элемент #back-button не найден')
        }
        this.backButton = backButton as HTMLButtonElement
        
        const statisticsButton: HTMLElement | null = document.getElementById('statistics-button')
        if (!statisticsButton) {
            throw new Error('Элемент #statistics-button не найден')
        }
        this.statisticsButton = statisticsButton

        const rootPathInput: HTMLElement | null = document.getElementById('root-path')
        if (!rootPathInput) {
            throw new Error('Элемент #root-path не найден')
        }
        this.rootPathInput = rootPathInput as HTMLInputElement

        this.initEventListeners()
    }

    // Изменяет корневой путь в input
    public changeRootPath(path: string) {
        if (path.length == 0) {
            path = '/'
        }

        this.rootPathInput.value = path
        if (path === '/') {
            this.backButton.disabled = true
        } else {
            this.backButton.disabled = false
        }
    }

    // Инициализирует отслеживание нажатия на секцию содержимого таблицы
    private initEventListeners() {
        // Переход в выбранную директорию и обновление таблицы
        this.dirTable.dirEntitiesList.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const tr = target.closest('tr');

            if (tr?.classList.contains('selectable')) {
                const dirNameElement = tr.querySelector('td:nth-child(2)');
                if (dirNameElement) {
                    const dirName = dirNameElement.textContent ?? '';

                    if (this.rootPathInput.value === '/') {
                        this.changeRootPath('/' + dirName);
                    } else {
                        this.changeRootPath(`${this.rootPathInput.value}/${dirName}`);
                    }

                    this.LoadDirEntities();
                }
            }
        });

        // Получение страницы статистики
        this.statisticsButton.addEventListener('click', () => {
            window.location.href = this.configStatistics.getStatisticsServerUrl();
        });
    }

    // Обновление таблицы с блокировкой событий её обновления
    public LoadDirEntities() {
        this.disableEventsWhileLoading()

        this.dirTable.loadDirEntities(this.rootPathInput.value)
            .then(response => this.changeRootPath(response.root_dir))
            .catch(err => alert(err))
            .finally(() => this.enableEventsAfterLoading())
    }

    // Отключает события обновляющие таблицу
    private disableEventsWhileLoading() {
        this.backButton.style.pointerEvents = 'none'
    }

    // Включает события обновляющие таблицу
    private enableEventsAfterLoading() {
        this.backButton.style.pointerEvents = 'auto'
    }
}



