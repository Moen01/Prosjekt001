'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/page.module.css';
import Delay from './delay';

export default function Header({ onButtonClick }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleButtonClick = (buttonId) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onButtonClick(buttonId);
      if (buttonId === 1) {
        router.push('/(pre-prod)/ffmea/page');
      } else if (buttonId === 2) {
        router.push('/(pre-prod)/feasibility/page');
      } else if (buttonId === 3) {
        router.push('/(post-prod)/fmea/page');
      } else if (buttonId === 4) {
        router.push('/(post-prod)/sc/page');
      } else if (buttonId === 5) {
        router.push('/(post-prod)/control-plan/page');
      } else if (buttonId === 6) {
        router.push('/(pre-prod)/actions/page');
      } else if (buttonId === 7) {
        router.push('/(pre-prod)/documentation/page');
      }
    }, 2000); // Simulates a 2-second loading delay
  };

  return (
    <header className={styles.header}>
      {isLoading ? (
        <Delay />
      ) : (
        <div>
          <button
            className={styles.button1}
            onClick={() => handleButtonClick(1)} // Pass Button ID 1
          >
            Baseline
          </button>

          <button
            className={styles.button2}
            onClick={() => handleButtonClick(2)} // Pass Button ID 2
          >
            Feasibility
          </button>

          <button
            className={styles.button3}
            onClick={() => handleButtonClick(3)} // Pass Button ID 3
          >
            FMEA
          </button>

          <button
            className={styles.button3}
            onClick={() => handleButtonClick(4)} // Pass Button ID 4
          >
            SC
          </button>

          <button
            className={styles.button3}
            onClick={() => handleButtonClick(5)} // Pass Button ID 5
          >
            Control Plan
          </button>

          <button
            className={styles.button3}
            onClick={() => handleButtonClick(6)} // Pass Button ID 6
          >
            Actions
          </button>

          <button
            className={styles.button3}
            onClick={() => handleButtonClick(7)} // Pass Button ID 7
          >
            Documentation
          </button>
        </div>
      )}
    </header>
  );
}
