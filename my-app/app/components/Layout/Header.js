'use client';

import React from 'react';
import styles from '../../styles/page.module.css';

export default function Header() {
  const handleButtonClick = (url) => {
    window.location.href = url;
  };

  return (
    <header className={styles.header}>
    
          <button className={styles.button1}
          onClick={() => {
            handleButtonClick('./ffmea');  
          }}>Baseline</button>


          <button className={styles.button2}
          onClick={() => {
            handleButtonClick('./feasability');  
        }}>Fesability</button>

          <button 
          className={styles.button3}
          onClick={() => {
            handleButtonClick('./actions');  
        }}>FMEA</button>

<button 
          className={styles.button3}
          onClick={() => {
            handleButtonClick('./controlPlan');  
        }}>SC</button>

<button 
          className={styles.button3}
          onClick={() => {
            handleButtonClick('./documentationPrint');  
        }}
          >Control plan</button>

<button 
          className={styles.button3}
          onClick={() => {
            handleButtonClick('./fmea');  
        }}
          >Actions</button>

<button 
          className={styles.button3}
          onClick={() => {
            handleButtonClick('./sc');  
        }}
          >Documentation</button>

        
    </header>
  );
}