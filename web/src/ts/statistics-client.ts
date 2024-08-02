// Ответ от сервера статистики
export class StatisticResponse {
    public dirPath: string;         // Путь к директории
    public totalSize: number;       // Общий размер директории в байтах
    public loadTimeSeconds: number; // Время загрузки в секундах
    public createdAt: Date;         // Дата и время создания статистики

    constructor(dirPath: string, totalSize: number, loadTimeSeconds: number, createdAt: Date) {
        this.dirPath = dirPath;
        this.totalSize = totalSize;
        this.loadTimeSeconds = loadTimeSeconds;
        this.createdAt = createdAt;
    }
}

// Клиент для сервера статистики
export class StatisticsClient {
    // Отправляет GET запрос на сервер и получает статистику по директориям
    public async getStatistics(): Promise<StatisticResponse[]> {
        const url = `http://${process.env.APACHE_HOST}:${process.env.APACHE_PORT}/${process.env.APACHE_PATH_GET_STAT}`;
        const response = await fetch(url, { 
            method: 'GET'
        });
        
        if (response.status === 500) throw new Error("Внутренняя ошибка сервера");

        try {
            const json: any[] = await response.json();
    
            return json.map((statistic: any) => new StatisticResponse(
                statistic.dirPath,
                statistic.totalSize,
                statistic.loadTimeSeconds,
                new Date(statistic.createdAt)
            ));
        } catch (error) {
            throw new Error("Не удалось десериализовать ответ: " + error);
        }
    }
}

