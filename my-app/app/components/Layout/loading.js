'use client';

import styles from '../styles/loading.module.css';
import Delay from './delay';

export default function loading(){ 
    return( 
        
        <div className={styles.loader}>
        <div className={styles.loaderInner}>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
        </div>
        </div>
        
    )
}
