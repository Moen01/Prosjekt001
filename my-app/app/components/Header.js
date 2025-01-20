'use client';

import styles from '../page.module.css';

export default function Header() {
  const handleButtonClick = (url) => {
    window.location.href = url;
  };

  return (
    <header className={styles.header}>
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className={`${styles.button} ${styles[`button${i + 1}`]}`}>
          <button
            className={styles[`button${i + 1}`]}
            onClick={() => {
              if (i === 0) {
                handleButtonClick('https://pre-prod.f.fmea');
              }
            }}
          >
            Button {i + 1}
          </button>
          <p>Button {i + 1}</p>
        </div>
      ))}
    </header>
  );
}