import * as styles from './Table.module'
import {DirEntity, DirEntityType, SortOrder} from '../../model'
import React, {useEffect, useState} from "react";
import HeadCell from "../UI/table/cell/HeadCell/HeadCell";
import BodyCell from '../UI/table/cell/BodyCell/BodyCell';
import {buildAbsolutePath} from "../../path";

const loadingMessage = 'Загрузка...'
const errorLoadingMessage = 'Ошибка обновления таблицы'
const directoryIsEmpty = 'Директория пуста'

export function Table({dirEntities, path, sort}: {
    dirEntities: { isLoading: boolean, value: DirEntity[] | null },
    path: { value: string, set: (path: string) => void },
    sort: { value: SortOrder, toggle: () => void },
}) {
    const arrowClasses = `${styles.arrow} ${sort.value === SortOrder.DESC ? styles.down : ''}`

    const [message, setMessage] = useState(loadingMessage)
    useEffect(() => {
        if (dirEntities.isLoading) {
            setMessage(loadingMessage)
            return
        }

        if (dirEntities.value == null) {
            setMessage(errorLoadingMessage)
            return
        }

        if (dirEntities.value?.length === 0) {
            setMessage(directoryIsEmpty)
            return
        }

        setMessage('')
    }, [dirEntities.isLoading])

    const handleTableBodyClick = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement
        const parentTr = target.closest(`tr`)

        if (parentTr?.classList.contains(styles.selectable_row)) {
            const dirNameElement = parentTr.querySelector(`.${styles.table__cell_name}`);
            if (dirNameElement && dirNameElement.textContent) {
                path.set(buildAbsolutePath(path.value, dirNameElement.textContent))
            }
        }
    }

    return (
        <div className={styles.wrapper}>
            <table className={`${styles.table} ${styles.wrapper__table_head}`}>
                <thead>
                <tr>
                    <HeadCell className={styles.table__cell_type}>Тип</HeadCell>
                    <HeadCell className={styles.table__cell_name}>Имя</HeadCell>
                    <HeadCell className={styles.table__cell_size}>
                        <button className={styles.sort_button} onClick={sort.toggle} disabled={dirEntities.isLoading}>
                            <div className={arrowClasses}></div>
                            Размер
                        </button>
                    </HeadCell>
                </tr>
                </thead>
            </table>
            <div className={styles.wrapper__wrapper}>
                {message.length !== 0
                    ?
                    <div className={styles.table__info}>
                        <h2>{message}</h2>
                    </div>
                    :
                    <table className={`${styles.table} ${styles.wrapper__wrapper__table_body}`}>
                        <tbody onClick={handleTableBodyClick}>
                        {dirEntities.value?.map(entity => (
                            <tr
                                key={`${entity.type}-${entity.name}-${entity.size}`}
                                className={entity.type === DirEntityType.DIR ? styles.selectable_row : null}
                            >
                                <BodyCell className={styles.table__cell_type}>{entity.type}</BodyCell>
                                <BodyCell className={styles.table__cell_name}>{entity.name}</BodyCell>
                                <BodyCell className={styles.table__cell_size}>{entity.size}</BodyCell>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}