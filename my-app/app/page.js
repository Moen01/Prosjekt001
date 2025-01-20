
import styles from './page.module.css';

export default function func() {
  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h2>Left Pane</h2>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.rightPane}>
        <header className={styles.header}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={`${styles.button} ${styles[`button${i + 1}`]}`}>
              <button className={styles[`button${i + 1}`]}>Button {i + 1}</button>
              <p>Button {i + 1}</p>
            </div>
          ))}
        </header>
        <h2>This is the right pane</h2>
        
      </div>
    </div>
  );
}
