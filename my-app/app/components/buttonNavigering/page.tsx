'use client';

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import styles from "./buttonNavigering.module.css";

interface ButtonNavigeringProps {
  route: string;
  label: string;
  className?: string;
  disabled?: boolean;
}

export default function ButtonNavigering({
  route,
  label,
  className,
  disabled,
}: ButtonNavigeringProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (!disabled) {
      router.push(route);
    }
  }, [disabled, route, router]);

  return (
    <button
      type="button"
      className={clsx(styles.buttonNavigering, className)}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
