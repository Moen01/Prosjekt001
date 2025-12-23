import clsx from "clsx";
import styles from "../../styles/page.module.css";

interface BarometerProps {
  value: number;
  maxValue?: number;
  className?: string;
}

export default function Barometer({
  value,
  maxValue = 100,
  className,
}: BarometerProps) {
  const safeValue = Math.min(Math.max(value, 0), maxValue);
  const percentage = Math.round((safeValue / maxValue) * 100);

  return (
    <div className={clsx(styles.barometerContainer, className)}>
      <div className={styles.barometerTrack}>
        <div
          className={styles.barometerFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={styles.barometerLabel}>{percentage}%</span>
    </div>
  );
}
