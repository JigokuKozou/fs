import { SortOrder } from './fs-client'

export default class Sort {

    // Кнопка размера и стрелка сортировки
    public readonly size: {
        button: HTMLElement
        arrow: HTMLElement
    }

    private type: SortOrder = SortOrder.ASC

    constructor() {
        const sizeButton: HTMLElement | null = document.querySelector('thead .dir_table__size')
        if (!sizeButton) {
            throw new Error('Элемент .dir_table__size не найден')
        }

        const arrow: HTMLElement | null = sizeButton.querySelector('.arrow')
        if (!arrow) {
            throw new Error('Элемент .dir_table__size .arrow не найден')
        }

        this.size = {
            button: sizeButton,
            arrow: arrow
        }

        // Устанавливает тип сортировки по умолчанию и обновляет стрелку сортировки
        this.setType(SortOrder.DESC)
    }

    // Переключает тип сортировки
    public toggleType() {
        this.setType(this.type === SortOrder.ASC ?
            SortOrder.DESC : SortOrder.ASC)
    }

    public getType(): SortOrder {
        return this.type
    }

    // Устанавливает тип сортировки и обновляет стрелку сортировки
    // Принимает тип сортировки (fsClient.SortOrder.ASC или fsClient.SortOrder.DESC)
    public setType(newType: SortOrder) {
        switch (newType) {
            case SortOrder.DESC:
                this.size.arrow.classList.add('rotate')
                break;
            case SortOrder.ASC:
                this.size.arrow.classList.remove('rotate')
                break;
            default:
                throw new Error("Тип сортировки не распознан")
        }

        this.type = newType
    }
}
