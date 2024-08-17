import {DirSeparator} from "./model";

let dirSeparator: DirSeparator | null = null;

let rootDirectory: string | null = null;

export function setDirSeparator(separator: DirSeparator): void {
    switch (separator) {
        case DirSeparator.SLASH:
            rootDirectory = '/'
            break
        case DirSeparator.BACKSLASH:
            rootDirectory = 'C:\\'
            break
        default:
            throw new Error(`Неожиданный разделитель пути ${dirSeparator}`)
    }

    dirSeparator = separator
}

export function getDirSeparator(): DirSeparator | null {
    return dirSeparator
}

export function getRootDirectory(): string | null {
    return rootDirectory
}

export function isRootDirectory(path: string): boolean {
    return rootDirectory?.trim().toLowerCase() === path.trim().toLowerCase()
}

/**
 * Возвращает путь без последней директории или путь до корневой директории.
 * @param path - Путь
 * @returns Путь без последней директории или путь до корневой директории
 */
export function removeLastDirectory(path: string): string {
    if (rootDirectory === null || dirSeparator === null) {
        throw new Error('Не установлен разделитель пути')
    }

    if (path.trim().toLowerCase() === rootDirectory.trim().toLowerCase()) {
        return path;
    }

    // Найти последнюю позицию разделителя
    const lastSlashIndex = path.lastIndexOf(dirSeparator)

    // Путь до последнего разделителя (не включая)
    path = path.substring(0, lastSlashIndex)

    // Если путь меньше пути корневой директории - вернуть корневую директорию
    if (path.length < rootDirectory.length) {
        return rootDirectory;
    }

    return path
}

/**
 * Строит абсолютный путь из переданных путей.
 * @param basePath - Базовый путь
 * @param paths - Дополнительные пути
 * @returns Абсолютный путь
 */
export function buildAbsolutePath(basePath: string, ...paths: string[]): string {
    // Нормализуем базовый путь
    let absolutePath = basePath.replace(/\\/g, DirSeparator.SLASH) // Заменяем обратные слэши на прямые

    // Обрабатываем каждый дополнительный путь
    for (const p of paths) {
        // Нормализуем и объединяем пути
        absolutePath = absolutePath.replace(/\/+$/, '') + DirSeparator.SLASH + p.replace(/^\/*/, '').replace(/\\/g, DirSeparator.SLASH)
    }

    // Убираем возможные двойные слэши
    absolutePath = absolutePath.replace(/\/{2,}/g, DirSeparator.SLASH)

    if (dirSeparator === DirSeparator.BACKSLASH) {
        return absolutePath.replace(/\//g, DirSeparator.BACKSLASH)
    }

    return absolutePath;
}
