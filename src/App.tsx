import {useEffect, useRef, useState} from 'react';
import {Controls} from './components/Controls/Controls';
import {Table} from './components/Table/Table';
import * as styles from './App.module';
import {DirEntity, DirSeparator, FsClient, SortOrder} from './model';
import {setDirSeparator} from "./path";

const fsClient = new FsClient()

export function App() {
    const [path, setPath] = useState('')
    const [sort, setSort] = useState(SortOrder.DESC)
    const [dirEntities, setDirEntities] = useState<{ isLoading: boolean, value: DirEntity[] | null }>(
        {isLoading: true, value: null})

    const previousPathRef = useRef<string | null>(null)

    useEffect(() => {
        if (previousPathRef.current === path)
            return

        setDirEntities({isLoading: true, value: null});
        fsClient.fetchDirEntities(path, sort)
            .then(response => {
                if (response.entities) {
                    setDirEntities({isLoading: false, value: response.entities})
                    if (previousPathRef.current === null) {
                        setPath(response.root_dir)
                        previousPathRef.current = response.root_dir
                        setDirSeparator(response.root_dir.includes(DirSeparator.SLASH) ?
                            DirSeparator.SLASH : DirSeparator.BACKSLASH)
                    } else previousPathRef.current = path
                }
            })
            .catch(error => {
                setDirEntities({isLoading: false, value: null});
                console.error(error);
            });
    }, [path, sort]);

    const toggleSort = () => {
        setSort(sort === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC)
    }

    return (
        <div className={styles.wrapper}>
            <header className={styles.wrapper__header}>
                <h1 className={styles.wrapper__header__title}>Файловый менеджер</h1>
            </header>
            <section className={styles.wrapper__container}>
                <div className={styles.wrapper__container__content}>
                    <Controls path={{value: path, set: setPath}}
                              isLoading={dirEntities.isLoading}/>
                    <Table dirEntities={dirEntities}
                           path={{value: path, set: setPath}}
                           sort={{value: sort, toggle: toggleSort}}/>
                </div>
            </section>
            <footer className={styles.wrapper__footer}>
                <p className={styles.wrapper__footer__title}>© 2024. Все права защищены?</p>
            </footer>
        </div>
    )

}