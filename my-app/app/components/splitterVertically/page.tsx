import clsx from "clsx";
import styles from "./splitterVertically.module.css";

interface SplitterVerticallyProps {
  className?: string;
}

// Simple vertical divider used to separate two content areas.
export default function SplitterVertically({
  className,
}: SplitterVerticallyProps) {
  return <div className={clsx(styles.splitterVertically, className)} />;
}
