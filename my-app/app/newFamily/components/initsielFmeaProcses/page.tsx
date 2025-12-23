'use client';

import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import type { ProcessBox } from "@lib/types/fmea";
import { createId } from "@lib/utils/id";
import FmeaKort from "../fmeaKort/page";
import FmeaKortExtra from "../fmeaKortExtra/page";
import FmeaKortExtraContent from "../fmeaKortExtraContent/page";
import ProcessDefinerProcessBox from "../processDefinerProcessBox/page";
import RedSlidePanel from "../redSlidePanel/page";
import styles from "./initsielFmeaProcses.module.css";

interface InitsielFmeaProsessProps {
  title?: string | null;
  onProcessAdded?: () => void;
}

interface ActiveExtraState {
  boxId: string;
  cardId: string;
}

const createProcessBox = (): ProcessBox => ({
  id: createId(),
  rotatedText: { id: createId(), value: "", isBold: false },
  textFields: [],
  initialCardId: createId(),
  extraCardIds: [],
});

export default function InitsielFmeaProsess({
  title,
  onProcessAdded,
}: InitsielFmeaProsessProps) {
  const [processBoxes, setProcessBoxes] = useState<ProcessBox[]>([]);
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [activeExtra, setActiveExtra] = useState<ActiveExtraState | null>(null);

  const hasProcesses = useMemo(() => processBoxes.length > 0, [processBoxes]);

  const insertProcessBox = useCallback(
    (index?: number) => {
      setProcessBoxes((prev) => {
        const next = [...prev];
        if (typeof index === "number") {
          next.splice(index, 0, createProcessBox());
        } else {
          next.push(createProcessBox());
        }
        return next;
      });
      onProcessAdded?.();
    },
    [onProcessAdded]
  );

  const removeProcessBox = useCallback((processId: string) => {
    setProcessBoxes((prev) => prev.filter((box) => box.id !== processId));
  }, []);

  const addFmeaCard = useCallback((processId: string) => {
    setProcessBoxes((prev) =>
      prev.map((box) =>
        box.id === processId
          ? { ...box, extraCardIds: [...box.extraCardIds, createId()] }
          : box
      )
    );
  }, []);

  const handleDeleteProcess = useCallback(
    (processId: string) => {
      if (typeof window !== "undefined") {
        const confirmed = window.confirm(
          "Are you sure you want to delete this process?"
        );
        if (!confirmed) {
          return;
        }
      }
      removeProcessBox(processId);
    },
    [removeProcessBox]
  );

  return (
    <div className={styles.root}>
      <div className={styles.leftRail}>
        <span className={styles.tiltedText}>{title ?? "Process"}</span>
      </div>
      <div className={styles.processColumn}>
        {hasProcesses ? (
          processBoxes.map((box, index) => (
            <section key={box.id} className={styles.processCard}>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  title="Add process above"
                  onClick={() => insertProcessBox(index)}
                >
                  +
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  title="Remove process"
                  onClick={() => handleDeleteProcess(box.id)}
                >
                  ×
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  title="Add process below"
                  onClick={() => insertProcessBox(index + 1)}
                >
                  ↓
                </button>
              </div>

              <div className={styles.cardMeta}>
                <ProcessDefinerProcessBox />
                <div className={styles.processGrid}>
                  <FmeaKort />
                </div>
              </div>

              <div className={styles.extraZone}>
                <div className={styles.extraHeader}>
                  <span>Related FMEA Cards</span>
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => addFmeaCard(box.id)}
                  >
                    Add card
                  </button>
                </div>
                <div className={styles.extraList}>
                  {box.extraCardIds.map((cardId) => (
                    <FmeaKortExtra
                      key={cardId}
                      fmeaId={cardId}
                      onClick={() =>
                        setActiveExtra({ boxId: box.id, cardId })
                      }
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.slidePanelTrigger}
                  onClick={() =>
                    setActivePanelId((current) =>
                      current === box.id ? null : box.id
                    )
                  }
                >
                  Open process details
                </button>
              </div>

              <RedSlidePanel
                open={activePanelId === box.id}
                onClose={() => setActivePanelId(null)}
              />
            </section>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No processes added yet.</p>
            <button
              type="button"
              className={clsx(styles.addButton, styles.emptyButton)}
              onClick={() => insertProcessBox()}
            >
              Add process
            </button>
          </div>
        )}
      </div>

      {activeExtra ? (
        <FmeaKortExtraContent
          fmeaId={activeExtra.cardId}
          onClose={() => setActiveExtra(null)}
        />
      ) : null}
    </div>
  );
}
