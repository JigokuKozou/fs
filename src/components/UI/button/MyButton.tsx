import React from 'react';
import * as styles from './MyButton.module'

export const MyButton = ({children, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button {...props} className={styles.button}>
            {children}
        </button>
    );
};