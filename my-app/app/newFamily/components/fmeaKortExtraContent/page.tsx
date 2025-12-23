import { useState } from "react";
import FmeaKortExtraContentGreenButton from "../fmeaKortExtraContentGreenButton/page";
import styles from "./fmeaKortExtraContent.module.css";

interface FmeaKortExtraContentProps {
  fmeaId: string;
  onClose: () => void;
}

export default function FmeaKortExtraContent({
  fmeaId,
  onClose,
}: FmeaKortExtraContentProps) {
  const [showGreenPopup, setShowGreenPopup] = useState(false);

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>SOD card</h2>
          <span>#{fmeaId.slice(-6)}</span>
        </header>
        <div className={styles.boxwithBoxes}>
          <div className={styles.rowGroup}>
            {[1, 2, 3, 4].map((index) => (
              <div className={styles.boxRow} key={index}>
                <div className={styles.boxRow2of3} />
                <div className={styles.boxRow1of3} />
                <div className={styles.boxRow1of3} />
              </div>
            ))}
          </div>
          <div className={styles.preventiveSection}>
            <div className={styles.boxRow}>
              <div className={styles.boxRow2of3}>
                <button
                  className={styles.greenPlusBtn}
                  onClick={() => setShowGreenPopup(true)}
                  aria-label="Add preventive action"
                >
                  +
                </button>
              </div>
              <div className={styles.boxRow1of3} />
              <div className={styles.boxRow1of3} />
            </div>
            <div className={styles.boxRow}>
              <div className={styles.boxRow2of3} />
              <div className={styles.boxRow1of3} />
              <div className={styles.boxRow1of3} />
            </div>
            <div className={styles.boxRow}>
              <div className={styles.boxRow2of3}>SUM</div>
              <div className={styles.boxRow1of3} />
              <div className={styles.boxRow1of3} />
            </div>
          </div>
          <div className={styles.heatMapSection}>
            <div className={styles.heatMapBar}>
              <div className={styles.insideLine2of3Length} />
              <div className={styles.insideLineleft1of3} />
              <div className={styles.insideLinerigth1of3} />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.primaryButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      {showGreenPopup ? (
        <FmeaKortExtraContentGreenButton
          onClose={() => setShowGreenPopup(false)}
        />
      ) : null}
    </div>
  );
}
