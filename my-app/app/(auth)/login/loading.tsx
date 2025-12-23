
'use client';

import styles from "../../styles/loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderInner}>
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
      </div>
    </div>
  );
}

