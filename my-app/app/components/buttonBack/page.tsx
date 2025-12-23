import Link from "next/link";
import clsx from "clsx";
import styles from "./buttonBack.module.css";

interface ButtonBackProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function ButtonBack({
  href = "#",
  label = "Tilbake",
  className,
}: ButtonBackProps) {
  return (
    <Link href={href} className={clsx(styles.buttonBack, className)}>
      <span className={styles.icon} aria-hidden="true">
        ←
      </span>
      <span>{label}</span>
    </Link>
  );
}
