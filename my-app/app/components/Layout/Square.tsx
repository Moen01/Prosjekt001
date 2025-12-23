import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "../../styles/square.module.css";

interface SquareProps {
  children?: ReactNode;
  className?: string;
}

export default function Square({ children, className }: SquareProps) {
  return (
    <div className={clsx(styles.square, className)}>
      {children ?? "Midten av firkanten"}
    </div>
  );
}
