import React from "react";
import * as styles from './Controls.module'
import {MyButton} from "../UI/button/MyButton";
import {pathSeparator} from "../../App";

export function Controls({path, isLoading}: {
    path: { value: string, set: (path: string) => void },
    isLoading: boolean
}) {
    const handleMouseDown = (event: React.MouseEvent<any>) => {
        event.preventDefault(); // Предотвращает выделение текста при клике
    };

    return (
        <>
            <div className={styles.wrapper}>
                <MyButton
                    onClick={() => path.set(removeLastDirectory(path.value))}
                    disabled={isLoading}
                >Назад</MyButton>
                <input
                    className={styles.wrapper__root_path}
                    value={path.value}
                    readOnly
                    onMouseDown={handleMouseDown}
                />
                <MyButton>Статистика</MyButton>
            </div>
        </>)
}

function removeLastDirectory(path: string): string {
    // Найти последнюю позицию разделителя
    const lastSlashIndex = path.lastIndexOf(pathSeparator);

    // Если разделитель не найден, вернуть оригинальный путь
    if (lastSlashIndex === -1) return path;

    // Вернуть путь до последнего разделителя
    return path.substring(0, lastSlashIndex);
}