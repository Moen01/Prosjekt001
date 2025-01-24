'use client';

import React, { useState } from 'react';
import styles from '../../styles/page.module.css';
import Delay from './delay';

export default function Header({onButtonClick}) {
  const [isLoading, setIsLoading] = useState(false);
  
    const handleButtonClick = (button) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onButtonClick(button);
      }, 2000); // 2-second delay
  };

  return (
    
    <header className={styles.header}>
   
      {isLoading ? ( <Delay /> ) : ( <div>

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
  
      </div> )
  }  
    </header>
  );
}