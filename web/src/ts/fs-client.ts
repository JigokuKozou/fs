// Тип сущности
export enum DirEntityType {
    FILE = 'Файл',
    DIR = 'Дир'
}

// Тип сортировки
export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}

// Класс представляющий ответ сервера
export class FsClientResponse {
    public root_dir: string                 // Корневой путь
    public entities: DirEntity[] | null     // Список сущностей
    public error_code: number               // Код ошибки
    public error_message: string            // Сообщение ошибки

    constructor(root_dir: string, entities: DirEntity[], error_code: number, error_message: string) {
        this.root_dir = root_dir
        this.entities = entities
        this.error_code = error_code
        this.error_message = error_message
    }
}

// Класс представляющий сущность директории (файл/директория)
export class DirEntity {
    public type: DirEntityType  // Тип (файл/директория)
    public name: string         // Имя
    public size: string         // Размер (форматированный)

    constructor(type: DirEntityType, name: string, size: string) {
        this.type = type
        this.name = name
        this.size = size
    }
}

// Класс представляющий HTTP-клиент для получения доступа к файловой системе сервера
export class FsClient {

    // Запрос на получение информации о содержимом директории
    public async fetchDirEntity(rootPath: string, sortType: SortOrder): Promise<FsClientResponse> {
        const url = `/fs?root=${encodeURIComponent(rootPath)}&sort=${encodeURIComponent(sortType)}`;
        const response = await fetch(url, { method: "GET" })
            if (response.status === 500) {
                throw new Error("Внутренняя ошибка сервера")
            }

            const jsonBody = await response.json()

            // Десериализация JSON ответа в объект FsClientResponse
            return new FsClientResponse(
                jsonBody.rootDir,
                jsonBody.entities?.map((entity: any) => new DirEntity(
                        entity.type, 
                        entity.name, 
                        entity.formattedSize
                    )),
                jsonBody.errorCode,
                jsonBody.errorMessage
            )
    }
}
