import React from 'react';
import styles from '../styles/page.module.css';
import Header from '../components/Layout/Header';
import Delay from '../components/Layout/delay';

import Square from '../components/Layout/Square';
import PageRight from './pageHoyre';
import BoksModell from '../leftPane/boksModell/page';

export default function MainPage() {
  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h2>Left Pane</h2>
        <BoksModell />
      </div>

      <div className={styles.separator}></div>

      <PageRight />
    </div>
  );
}
