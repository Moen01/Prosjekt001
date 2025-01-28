
import React from 'react';
import styles from './styles/page.module.css';
import Header from './components/Layout/Header';
import Delay from './components/Layout/delay';
import Ffmea from './(pre-prod)/ffmea/page';
import Square from './components/Layout/Square';


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
        <Square />
      </div>
    </div>
  );
}
