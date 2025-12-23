import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "../../styles/page.module.css";

interface SplitScreenProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export default function SplitScreen({
  left,
  right,
  className,
}: SplitScreenProps) {
  return (
    <div className={clsx(styles.splitScreen, className)}>
      <div className={styles.splitScreenPane}>{left}</div>
      <div className={styles.splitScreenPane}>{right}</div>
    </div>
  );
}
