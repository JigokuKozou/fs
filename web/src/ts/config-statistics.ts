// Конфигурация статистики приложения
export class ConfigStatistics {

    public readonly host: string = process.env.APACHE_HOST ?? 'localhost';
    public readonly port: string = process.env.APACHE_PORT ?? '80';
    public readonly getStat: string = process.env.APACHE_PATH_GET_STAT ?? '';
    
    // Получить URL сервера для получения статистики
    public getStatisticsServerUrl(): string {
        return `http://${this.host}:${this.port}/${this.getStat}`;
    }
}
