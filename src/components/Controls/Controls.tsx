import React from "react";
import * as styles from './Controls.module'
import {MyButton} from "../UI/button/MyButton";
import {isRootDirectory, removeLastDirectory} from "../../path";
import {ConfigStatistics} from '../../model'

const configStatistics = new ConfigStatistics()

export function Controls({path, isLoading}: {
    path: { value: string, set: (path: string) => void },
    isLoading: boolean
}) {
    const handleMouseDown = (event: React.MouseEvent<any>) => {
        event.preventDefault() // Предотвращает выделение текста при клике
    }

    const handleClickStatistics = () => {
        window.location.href = configStatistics.getStatisticsServerUrl()
    }

    return (
        <>
            <div className={styles.wrapper}>
                <MyButton
                    onClick={() => path.set(removeLastDirectory(path.value))}
                    disabled={isLoading || isRootDirectory(path.value)}
                >Назад</MyButton>
                <input
                    className={styles.wrapper__root_path}
                    value={path.value}
                    readOnly
                    onMouseDown={handleMouseDown}
                />
                <MyButton onClick={handleClickStatistics}>Статистика</MyButton>
            </div>
        </>)
}