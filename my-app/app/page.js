
import React from 'react';
import styles from './styles/page.module.css';
import Header from './components/Layout/Header';
import Delay from './components/Layout/delay';
import Ffmea from './(pre-prod)/f.fmea/page';


export default function MainPage() {

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h2>Left Pane</h2>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.rightPane}>
        
        <Header />
        <h2>This is the right pane</h2>
        <Ffmea />
      </div>
    </div>
  );
}
