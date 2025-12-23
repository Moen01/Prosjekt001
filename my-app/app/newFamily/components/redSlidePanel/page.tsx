'use client';

import { Fragment, useState } from "react";
import { createId } from "@lib/utils/id";
import FmeaKortExtra from "../fmeaKortExtra/page";
import FmeaKortExtraContent from "../fmeaKortExtraContent/page";
import styles from "./redSlidePanel.module.css";

const TITLES = ["Man", "Machine", "Measure", "Milieu", "Material"];

interface RedSlidePanelProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function RedSlidePanel({
  open,
  onClose,
  children,
}: RedSlidePanelProps) {
  const [redPanelCards, setRedPanelCards] = useState<string[][]>(
    TITLES.map(() => [])
  );
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const addRedPanelCard = (columnIndex: number) => {
    setRedPanelCards((prev) =>
      prev.map((cards, index) =>
        index === columnIndex ? [...cards, createId()] : cards
      )
    );
  };

  if (!open) {
    return null;
  }

  return (
    <div className={styles.redSlidePanel}>
      <div className={styles.redSlideTopList}>
        <div className={styles.redSlideTitleColumns}>
          {TITLES.map((title, columnIndex) => (
            <div key={title} className={styles.redSlideTitleCol}>
              <div className={styles.redSlideTitleHeader}>
                <button
                  className={styles.redSlidePlusBtn}
                  onClick={() => addRedPanelCard(columnIndex)}
                  title={`Add card for ${title}`}
                  type="button"
                >
                  +
                </button>
                <span className={styles.redSlideTitle}>{title}</span>
              </div>
              <div className={styles.redSlideExtraCards}>
                {redPanelCards[columnIndex].map((cardId) => (
                  <Fragment key={cardId}>
                    <FmeaKortExtra
                      fmeaId={cardId}
                      onClick={() => setActiveCardId(cardId)}
                    />
                    {activeCardId === cardId ? (
                      <div className={styles.fmeaKortExtraModal}>
                        <FmeaKortExtraContent
                          fmeaId={cardId}
                          onClose={() => setActiveCardId(null)}
                        />
                      </div>
                    ) : null}
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className={styles.redSlideCloseBtn}
        onClick={onClose}
        title="Close"
        type="button"
      >
        <span style={{ fontSize: 24, fontWeight: "bold" }}>&#8594;</span>
      </button>
      <div className={styles.redSlideContent}>{children}</div>
    </div>
  );
}
