
import styles from './page.module.css';
import Header from './components/Header';

export default function func() {
  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h2>Left Pane</h2>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.rightPane}>
        <Header />
        <h2>This is the right pane</h2>
        
      </div>
    </div>
  );
}
