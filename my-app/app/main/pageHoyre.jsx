
import React from 'react';
import styles from '../styles/page.module.css';
import Header from '../components/Layout/Header';
import Delay from '../components/Layout/delay';
import Ffmea from '../(pre-prod)/ffmea/page';
import Square from '../components/Layout/Square';


export default function PageRight() {
  
    return (
        <div className={styles.rightPane}>
        <Header />
        <Ffmea />
        <Square />
      </div> 
    );
}
