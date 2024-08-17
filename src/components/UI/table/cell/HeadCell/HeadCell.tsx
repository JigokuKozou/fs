import React from 'react';
import * as styles from './HeadCell.module'

const HeadCell = ({children, className, ...props}: React.ThHTMLAttributes<any>) => {
    return (
        <th {...props} className={`${className} ${styles.cell_title}`}>
            {children}
        </th>
    );
};

export default HeadCell;