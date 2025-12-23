import clsx from "clsx";
import styles from "./splitterHorizontally.module.css";

interface SplitterHorizontallyProps {
  className?: string;
}

// Horizontal divider used to separate stacked content.
export default function SplitterHorizontally({
  className,
}: SplitterHorizontallyProps) {
  return <div className={clsx(styles.splitterHorizontally, className)} />;
}
