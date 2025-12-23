import clsx from "clsx";
import styles from "./fmeaKort.module.css";

interface FmeaKortProps {
  title?: string;
  className?: string;
}

export default function FmeaKort({ title = "Productivity Process", className }: FmeaKortProps) {
  return (
    <div className={clsx(styles.fmeaKortGrid, className)}>
      <div className={clsx(styles.fmeaMerge, styles.group1)} style={{ gridArea: "g1" }}>
        {title}
      </div>
      <div className={styles.fmeaKortCell} style={{ gridArea: "r1c4" }}>
        1
      </div>
      <div className={styles.fmeaKortCell} style={{ gridArea: "r1c5" }}>
        2
      </div>
      <div className={styles.fmeaKortCell} style={{ gridArea: "r1c6" }}>
        3
      </div>
      <div className={styles.fmeaKortCell} style={{ gridArea: "r2c4" }}>
        4
      </div>
      <div className={clsx(styles.fmeaMerge, styles.group2)} style={{ gridArea: "g2" }}>
        Group 2
      </div>
      <div className={clsx(styles.fmeaMerge, styles.group3)} style={{ gridArea: "g3" }}>
        Group 3
      </div>
      <div className={styles.fmeaKortCell} style={{ gridArea: "r3c4" }}>
        5
      </div>
      <div className={clsx(styles.fmeaKortCell, styles.redBg)} style={{ gridArea: "r3c5" }}>
        H
      </div>
      <div className={clsx(styles.fmeaKortCell, styles.redBg)} style={{ gridArea: "r3c6" }}>
        H
      </div>
    </div>
  );
}
