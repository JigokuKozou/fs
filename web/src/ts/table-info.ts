// Класс представляющий информацию внутри секции талицы
export default class TableInfo {
    // Секция таблицы в которой необходимо отобразить информацию
    public readonly parent: HTMLTableSectionElement;
    
    // Строка таблицы с текстовым элементом
    public readonly element: HTMLTableRowElement;

    // Текстовый элемент в котором отображается информация
    public readonly textContainer: HTMLElement;

    public constructor(parent: HTMLTableSectionElement) {
        this.parent = parent;
        const element: HTMLTableRowElement | null = document.querySelector('.dir_table__info');
        if (!element) {
            throw new Error('Элемент .dir_table__info не найден');
        }
        this.element = element;

        const textContainer: HTMLElement | null = element.querySelector('h2');
        if (!textContainer) {
            throw new Error('Элемент .dir_table__info h2 не найден');
        }
        this.textContainer = textContainer;
    }

    // Показать сообщение внутри parent или изменить текст сообщения
    public show(message: string) {
        this.textContainer.textContent = message;
        
        if (!this.element.isConnected) {
            this.parent.appendChild(this.element);
        }
    }

    // Скрыть сообщение внутри parent
    public hide() {
        this.parent.removeChild(this.element);
    }
}