import React from 'react';
import * as styles from './BodyCell.module'

const BodyCell = ({children, className, ...props}: React.ThHTMLAttributes<any>) => {
    return (
        <td {...props} className={`${className} ${styles.cell_body}`}>
            {children}
        </td>
    );
};

export default BodyCell;