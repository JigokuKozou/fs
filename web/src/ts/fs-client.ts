
export enum DirEntityType {
    FILE = 'Файл',
    DIR = 'Дир'
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}

export class FsClientResponse {
    public root_dir: string
    public entities: DirEntity[] | null
    public error_code: number
    public error_message: string

    constructor(root_dir: string, entities: DirEntity[], error_code: number, error_message: string) {
        this.root_dir = root_dir
        this.entities = entities
        this.error_code = error_code
        this.error_message = error_message
    }
}

export class DirEntity {
    public type: DirEntityType
    public name: string
    public size: string

    constructor(type: DirEntityType, name: string, size: string) {
        this.type = type
        this.name = name
        this.size = size
    }
}

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
            const fsClientResponse = new FsClientResponse(
                jsonBody.root_dir,
                jsonBody.entities?.map((entity: any) => new DirEntity(
                        entity.type, 
                        entity.name, 
                        entity.size
                    )),
                jsonBody.error_code,
                jsonBody.error_message
            )

            return fsClientResponse
    }
}
