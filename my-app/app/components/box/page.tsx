import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./box.module.css";

interface BoxProps {
  children: ReactNode;
  className?: string;
}

export default function Box({ children, className }: BoxProps) {
  return <div className={clsx(styles.box, className)}>{children}</div>;
}
