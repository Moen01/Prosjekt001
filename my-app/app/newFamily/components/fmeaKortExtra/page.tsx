import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import cardStyles from "../fmeaKort/fmeaKort.module.css";
import styles from "./fmeaKortExtra.module.css";

interface FmeaKortExtraProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  fmeaId: string;
  title?: string;
}

export default function FmeaKortExtra({
  fmeaId,
  title = "Supplemental Process",
  className,
  ...props
}: FmeaKortExtraProps) {
  return (
    <button
      type="button"
      className={clsx(cardStyles.fmeaKortGrid, styles.extraCard, className)}
      {...props}
    >
      <div className={clsx(cardStyles.fmeaMerge, cardStyles.group1)} style={{ gridArea: "g1" }}>
        {title}
      </div>
      <div className={cardStyles.fmeaKortCell} style={{ gridArea: "r1c4" }}>
        1
      </div>
      <div className={cardStyles.fmeaKortCell} style={{ gridArea: "r1c5" }}>
        2
      </div>
      <div className={cardStyles.fmeaKortCell} style={{ gridArea: "r1c6" }}>
        3
      </div>
      <div className={cardStyles.fmeaKortCell} style={{ gridArea: "r2c4" }}>
        4
      </div>
      <div className={clsx(cardStyles.fmeaMerge, cardStyles.group2)} style={{ gridArea: "g2" }}>
        Group 2
      </div>
      <div className={clsx(cardStyles.fmeaMerge, cardStyles.group3)} style={{ gridArea: "g3" }}>
        Card {fmeaId.slice(-4)}
      </div>
      <div className={cardStyles.fmeaKortCell} style={{ gridArea: "r3c4" }}>
        5
      </div>
      <div className={clsx(cardStyles.fmeaKortCell, cardStyles.redBg)} style={{ gridArea: "r3c5" }}>
        H
      </div>
      <div className={clsx(cardStyles.fmeaKortCell, cardStyles.redBg)} style={{ gridArea: "r3c6" }}>
        H
      </div>
    </button>
  );
}
