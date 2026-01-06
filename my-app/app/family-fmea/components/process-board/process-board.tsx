"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import clsx from "clsx";
import { createId } from "@lib/utils/id";
import type { Process, ProcessStatus } from "@lib/types/familyFmea";
import styles from "./process-board.module.css";

interface ProcessBoardProps {
  familyCode: string;
  processes: Process[];
  selectedProcessId: string | null;
  onSelectProcess: (processId: string) => void;
  onToggleProcessStatus: (processId: string) => void;
  onToggleEquipmentStatus: (processId: string, equipmentId: string) => void;
  onAddProcess: () => void;
  onAddEquipment: (processId: string) => void;
}

const statusLabel: Record<ProcessStatus, string> = {
  not_started: "Not started",
  in_progress: "In work",
  completed: "Completed",
};

// 5M labels for the equipment-panel dropdown.
const EQUIPMENT_5M_LABELS = ["Man", "Machine", "Measure", "Milue", "Material"];

// Main process flow board inspired by the Rev 5 Family FMEA slides.
export default function ProcessBoard({
  familyCode,
  processes,
  selectedProcessId,
  onSelectProcess,
  onToggleProcessStatus,
  onToggleEquipmentStatus,
  onAddProcess,
  onAddEquipment,
}: ProcessBoardProps) {
  const cardRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const [processHeights, setProcessHeights] = useState<Record<string, number>>(
    {}
  );
  const equipmentHeaderRefs = useRef(new Map<string, HTMLDivElement | null>());
  const [equipmentHeaderHeights, setEquipmentHeaderHeights] = useState<
    Record<string, number>
  >({});
  const [equipmentPanels, setEquipmentPanels] = useState<
    Record<
      string,
      { open: boolean; items: Record<string, { id: string; label: string }[]> }
    >
  >({});
  const selectedProcess =
    processes.find((process) => process.id === selectedProcessId) ??
    processes[0];

  useLayoutEffect(() => {
    const elements = Array.from(cardRefs.current.values()).filter(
      (element): element is HTMLButtonElement => Boolean(element)
    );

    if (elements.length === 0) return;

    const updateHeights = (targets: HTMLElement[]) => {
      setProcessHeights((prev) => {
        let next = prev;
        let changed = false;

        targets.forEach((target) => {
          const processId = target.dataset.processId;
          if (!processId) return;
          const height = Math.round(target.getBoundingClientRect().height);
          if (prev[processId] !== height) {
            if (!changed) {
              next = { ...prev };
              changed = true;
            }
            next[processId] = height;
          }
        });

        return changed ? next : prev;
      });
    };

    updateHeights(elements);

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      updateHeights(entries.map((entry) => entry.target as HTMLElement));
    });

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [processes]);

  useLayoutEffect(() => {
    const elements = Array.from(equipmentHeaderRefs.current.values()).filter(
      (element): element is HTMLDivElement => Boolean(element)
    );

    if (elements.length === 0) return;

    const updateHeights = (targets: HTMLElement[]) => {
      setEquipmentHeaderHeights((prev) => {
        let next = prev;
        let changed = false;

        targets.forEach((target) => {
          const processId = target.dataset.processId;
          if (!processId) return;
          const height = Math.round(target.getBoundingClientRect().height);
          if (prev[processId] !== height) {
            if (!changed) {
              next = { ...prev };
              changed = true;
            }
            next[processId] = height;
          }
        });

        return changed ? next : prev;
      });
    };

    updateHeights(elements);

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      updateHeights(entries.map((entry) => entry.target as HTMLElement));
    });

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [processes]);

  const toggleEquipmentPanel = (processId: string) => {
    setEquipmentPanels((prev) => {
      const current = prev[processId] ?? { open: false, items: {} };
      // Store open state per process for the 5M panel.
      return { ...prev, [processId]: { ...current, open: !current.open } };
    });
  };

  const addEquipmentPanelItem = (processId: string, label: string) => {
    setEquipmentPanels((prev) => {
      const current = prev[processId] ?? { open: true, items: {} };
      const itemsForLabel = current.items[label] ?? [];
      const nextItem = {
        id: createId(),
        label: `${label} element ${itemsForLabel.length + 1}`,
      };
      return {
        ...prev,
        [processId]: {
          open: true,
          items: { ...current.items, [label]: [...itemsForLabel, nextItem] },
        },
      };
    });
  };

  return (
    <section className={styles.board}>
      <div className={styles.familyRail}>
        <span className={styles.familyCode}>{familyCode}</span>
      </div>

      <div className={styles.boardSurface}>
        <span className={styles.processHeader}>Processes</span>

        {processes.map((process) => {
          const isSelected = selectedProcess?.id === process.id;
          const clampHeight = processHeights[process.id];

          return (
            <div key={process.id} className={styles.processRow}>
              <button
                type="button"
                className={clsx(styles.processCard, {
                  [styles.processCardActive]: process.id === selectedProcess?.id,
                })}
                data-process-id={process.id}
                ref={(element) => {
                  if (element) {
                    cardRefs.current.set(process.id, element);
                  } else {
                    cardRefs.current.delete(process.id);
                  }
                }}
                onClick={() => onSelectProcess(process.id)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onToggleProcessStatus(process.id);
                }}
              >
                <div className={styles.processTitleRow}>
                  <span className={styles.processName}>{process.name}</span>
                  <span
                    className={clsx(
                      styles.processStatus,
                      styles[`status${process.status}`]
                    )}
                  >
                    {statusLabel[process.status]}
                  </span>
                </div>
                <p className={styles.processNotes}>{process.notes}</p>
              </button>

              <div
                className={clsx(styles.equipmentPanel, {
                  [styles.equipmentPanelInactive]: !isSelected,
                })}
                style={
                  !isSelected && clampHeight
                    ? ({
                        "--equipment-clamp-height": `${clampHeight}px`,
                      } as CSSProperties)
                    : undefined
                }
              >
                <div
                  className={styles.equipmentHeader}
                  data-process-id={process.id}
                  ref={(element) => {
                    if (element) {
                      equipmentHeaderRefs.current.set(process.id, element);
                    } else {
                      equipmentHeaderRefs.current.delete(process.id);
                    }
                  }}
                >
                  <div>
                    <p className={styles.equipmentKicker}>Equipment</p>
                    <h3 className={styles.equipmentTitle}>{process.name}</h3>
                  </div>
                  <button
                    type="button"
                    className={styles.addEquipment}
                    onClick={() => onAddEquipment(process.id)}
                    disabled={!isSelected}
                  >
                    Add element
                  </button>
                </div>

                <div className={styles.equipmentGrid}>
                  {process.equipment.map((equipment) => (
                    <div
                      key={equipment.id}
                      className={clsx(
                        styles.equipmentCard,
                        styles[`status${equipment.status}`]
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        // Allow selection from faded rows without toggling status.
                        if (!isSelected) {
                          onSelectProcess(process.id);
                          return;
                        }
                        onToggleEquipmentStatus(process.id, equipment.id);
                      }}
                    >
                      <span className={styles.equipmentName}>
                        {equipment.name}
                      </span>
                      <span className={styles.equipmentStatus}>
                        {statusLabel[equipment.status]}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={styles.equipment5mToggle}
                  onClick={() => toggleEquipmentPanel(process.id)}
                  disabled={!isSelected}
                >
                  5M
                </button>

                {equipmentPanels[process.id]?.open ? (
                  <div
                    className={styles.equipment5mPanel}
                    style={
                      equipmentHeaderHeights[process.id]
                        ? ({
                            "--equipment-header-height": `${equipmentHeaderHeights[
                              process.id
                            ]}px`,
                          } as CSSProperties)
                        : undefined
                    }
                  >
                    <div className={styles.equipment5mButtons}>
                      {EQUIPMENT_5M_LABELS.map((label) => (
                        <div key={label} className={styles.equipment5mColumn}>
                          <button
                            type="button"
                            className={styles.equipment5mButton}
                            onClick={() => addEquipmentPanelItem(process.id, label)}
                          >
                            {label}
                          </button>
                          <div className={styles.equipment5mItems}>
                            {(equipmentPanels[process.id]?.items[label] ?? []).map(
                              (item) => (
                                <div key={item.id} className={styles.equipment5mItem}>
                                  {item.label}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        <button type="button" className={styles.addProcess} onClick={onAddProcess}>
          <span>Add process</span>
          <span className={styles.addIcon}>+</span>
        </button>
      </div>
    </section>
  );
}
