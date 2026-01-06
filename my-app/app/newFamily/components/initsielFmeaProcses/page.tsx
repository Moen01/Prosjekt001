"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import clsx from "clsx";
import { createId } from "@lib/utils/id";
import styles from "./initsielFmeaProcses.module.css";

type ProcessStatus = "not-started" | "in-progress" | "completed";

interface Equipment {
  id: string;
  title: string;
  status: ProcessStatus;
}

interface ProcessRow {
  id: string;
  title: string;
  status: ProcessStatus;
  notes: string;
  equipment: Equipment[];
}

interface InitsielFmeaProsessProps {
  title?: string | null;
  onProcessAdded?: () => void;
}

// 5M labels for the equipment dropdown.
const EQUIPMENT_5M_LABELS = ["Man", "Machine", "Measure", "Milieu", "Material"];

const statusCycle: Record<ProcessStatus, ProcessStatus> = {
  "not-started": "in-progress",
  "in-progress": "completed",
  completed: "not-started",
};

const initialProcesses: ProcessRow[] = [
  {
    id: "converter",
    title: "Converter",
    status: "completed",
    notes: "Equipment installed with FAT report.",
    equipment: [
      { id: "conv-chem", title: "Chemical composition", status: "completed" },
      { id: "conv-yield", title: "Yield strength", status: "in-progress" },
      { id: "conv-uts", title: "Ultimate tensile strength", status: "not-started" },
    ],
  },
  {
    id: "cnc",
    title: "CNC machine",
    status: "in-progress",
    notes: "Fixtures missing torque validation.",
    equipment: [
      { id: "cnc-fixt", title: "Fixtures", status: "in-progress" },
      { id: "cnc-prog", title: "Programs", status: "not-started" },
      { id: "cnc-maint", title: "Maintenance plan", status: "not-started" },
    ],
  },
  {
    id: "robot",
    title: "Robot cell",
    status: "not-started",
    notes: "Awaiting layout approval.",
    equipment: [
      { id: "robot-gripper", title: "Gripper kit", status: "not-started" },
      { id: "robot-safety", title: "Safety validation", status: "not-started" },
      { id: "robot-training", title: "Operator training", status: "not-started" },
    ],
  },
];

export default function InitsielFmeaProsess({
  title,
  onProcessAdded,
}: InitsielFmeaProsessProps) {
  const [processes, setProcesses] = useState<ProcessRow[]>(initialProcesses);
  const [selectedProcessId, setSelectedProcessId] = useState<string>(
    initialProcesses[0]?.id ?? ""
  );
  const [equipmentPanels, setEquipmentPanels] = useState<
    Record<string, { open: boolean; items: { id: string; label: string }[] }>
  >({});
  const equipmentRefs = useRef(new Map<string, HTMLDivElement | null>());
  const [equipmentHeights, setEquipmentHeights] = useState<Record<string, number>>(
    {}
  );

  const selectedProcess = useMemo(
    () => processes.find((row) => row.id === selectedProcessId) ?? processes[0],
    [processes, selectedProcessId]
  );

  useLayoutEffect(() => {
    const elements = Array.from(equipmentRefs.current.values()).filter(
      (element): element is HTMLDivElement => Boolean(element)
    );

    if (elements.length === 0) return;

    const updateHeights = (targets: HTMLElement[]) => {
      setEquipmentHeights((prev) => {
        let next = prev;
        let changed = false;

        targets.forEach((target) => {
          const equipmentId = target.dataset.equipmentId;
          if (!equipmentId) return;
          const height = Math.round(target.getBoundingClientRect().height);
          if (prev[equipmentId] !== height) {
            if (!changed) {
              next = { ...prev };
              changed = true;
            }
            next[equipmentId] = height;
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

  const handleToggleProcessStatus = useCallback((processId: string) => {
    setProcesses((prev) =>
      prev.map((row) =>
        row.id === processId
          ? { ...row, status: statusCycle[row.status] }
          : row
      )
    );
  }, []);

  const handleToggleEquipmentStatus = useCallback(
    (processId: string, equipmentId: string) => {
      setProcesses((prev) =>
        prev.map((row) =>
          row.id === processId
            ? {
                ...row,
                equipment: row.equipment.map((item) =>
                  item.id === equipmentId
                    ? { ...item, status: statusCycle[item.status] }
                    : item
                ),
              }
            : row
        )
      );
    },
    []
  );

  const handleAddProcess = () => {
    const newProcess: ProcessRow = {
      id: createId(),
      title: `Process ${processes.length + 1}`,
      status: "not-started",
      notes: "Add notes or key actions for this process.",
      equipment: [
        { id: createId(), title: "Quality controls", status: "not-started" },
        { id: createId(), title: "Preventive maintenance", status: "not-started" },
        { id: createId(), title: "Documentation", status: "not-started" },
      ],
    };

    setProcesses((prev) => [...prev, newProcess]);
    setSelectedProcessId(newProcess.id);
    onProcessAdded?.();
  };

  const handleAddEquipment = (processId: string) => {
    setProcesses((prev) =>
      prev.map((row) =>
        row.id === processId
          ? {
              ...row,
              equipment: [
                ...row.equipment,
                {
                  id: createId(),
                  title: `New element ${row.equipment.length + 1}`,
                  status: "not-started",
                },
              ],
            }
          : row
      )
    );
  };

  const toggleEquipmentPanel = useCallback((equipmentId: string) => {
    setEquipmentPanels((prev) => {
      const current = prev[equipmentId] ?? { open: false, items: [] };
      // Track open state per equipment for the 5M dropdown.
      return { ...prev, [equipmentId]: { ...current, open: !current.open } };
    });
  }, []);

  const addEquipmentPanelItem = useCallback((equipmentId: string, label: string) => {
    setEquipmentPanels((prev) => {
      const current = prev[equipmentId] ?? { open: true, items: [] };
      const nextItem = {
        id: createId(),
        label: `${label} element ${current.items.length + 1}`,
      };
      return {
        ...prev,
        [equipmentId]: { open: true, items: [...current.items, nextItem] },
      };
    });
  }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.board}>
        <div className={styles.familyColumn}>
          <span className={styles.familyLabel}>
            {(title ?? "B62").toUpperCase()}
          </span>
        </div>

        <div className={styles.processColumn}>
          {processes.map((process) => (
            <article key={process.id} className={styles.processRow}>
              <div
                className={clsx(styles.processHeader, {
                  [styles.processHeaderSelected]: process.id === selectedProcess?.id,
                })}
                onClick={() => setSelectedProcessId(process.id)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  handleToggleProcessStatus(process.id);
                }}
              >
                <div className={styles.processTitleRow}>
                  <span className={styles.processName}>{process.title}</span>
                  <span
                    className={clsx(
                      styles.processStatus,
                      styles[`status${process.status.replace("-", "")}`]
                    )}
                  >
                    {process.status === "completed"
                      ? "Completed"
                      : process.status === "in-progress"
                      ? "In work"
                      : "Not started"}
                  </span>
                </div>
                <p className={styles.processNotes}>{process.notes}</p>
              </div>

              <div className={styles.equipmentTrack}>
                {process.equipment.map((equipment) => (
                  <div key={equipment.id} className={styles.equipmentStack}>
                    <div
                      className={clsx(
                        styles.equipmentCard,
                        styles[`equipment${equipment.status.replace("-", "")}`]
                      )}
                      data-equipment-id={equipment.id}
                      ref={(element) => {
                        if (element) {
                          equipmentRefs.current.set(equipment.id, element);
                        } else {
                          equipmentRefs.current.delete(equipment.id);
                        }
                      }}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        handleToggleEquipmentStatus(process.id, equipment.id);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span className={styles.equipmentTitle}>{equipment.title}</span>
                      <span className={styles.equipmentStatus}>
                        {equipment.status === "completed"
                          ? "Completed"
                          : equipment.status === "in-progress"
                          ? "In work"
                          : "Not started"}
                      </span>
                      <button
                        type="button"
                        className={styles.equipment5mTag}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleEquipmentPanel(equipment.id);
                        }}
                        aria-expanded={equipmentPanels[equipment.id]?.open ?? false}
                      >
                        5M
                      </button>
                    </div>

                    {equipmentPanels[equipment.id]?.open ? (
                      <div
                        className={styles.equipment5mPanel}
                        style={
                          equipmentHeights[equipment.id]
                            ? ({
                                "--equipment-card-height": `${equipmentHeights[
                                  equipment.id
                                ]}px`,
                              } as CSSProperties)
                            : undefined
                        }
                      >
                        <div className={styles.equipment5mButtons}>
                          {EQUIPMENT_5M_LABELS.map((label) => (
                            <button
                              key={label}
                              type="button"
                              className={styles.equipment5mButton}
                              onClick={() => addEquipmentPanelItem(equipment.id, label)}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <div className={styles.equipment5mItems}>
                          {equipmentPanels[equipment.id]?.items.map((item) => (
                            <div key={item.id} className={styles.equipment5mItem}>
                              {item.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.addEquipmentCard}
                  onClick={() => handleAddEquipment(process.id)}
                >
                  <span aria-hidden>＋</span>
                  Add element
                </button>
              </div>
            </article>
          ))}

          <button
            type="button"
            className={styles.addProcessButton}
            onClick={handleAddProcess}
          >
            Add process
          </button>
        </div>
      </div>
    </section>
  );
}
