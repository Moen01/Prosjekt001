"use client";

import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Process, ProcessStatus } from "@lib/types/familyFmea";
import EquipmentPanel from "../equipment-panel/equipment-panel";
import ProcessCharacteristicsCard from "../process-characteristics-card/process-characteristics-card";
import styles from "./process-board.module.css";

/**
 * Process board props for rendering the main flow and equipment column.
 */
interface ProcessBoardProps {
  /** Family code displayed in the left rail. */
  familyCode: string;
  /** Processes rendered in the board. */
  processes: Process[];
  /** Active process id for selection and equipment display. */
  selectedProcessId: string | null;
  /** Selects a process by id. */
  onSelectProcess: (processId: string) => void;
  /** Cycles the status of a process. */
  onToggleProcessStatus: (processId: string) => void;
  /** Cycles the status of an equipment item. */
  onToggleEquipmentStatus: (processId: string, equipmentId: string) => void;
  /** Opens the process creation flow. */
  onAddProcess: () => void;
  /** Opens the equipment creation flow for a process. */
  onAddEquipment: (processId: string) => void;
  /** Opens the edit flow for a process-attached element. */
  onEditProcessElement: (processId: string) => void;
  /** Opens the edit flow for an equipment element. */
  onEditEquipment: (processId: string, equipmentId: string) => void;
}

const statusLabel: Record<ProcessStatus, string> = {
  not_started: "Not started",
  in_progress: "In work",
  completed: "Completed",
};

// Main process flow board inspired by the Rev 5 Family FMEA slides.
/**
 * Responsibility:
 * Render the process list and delegate equipment UI to the equipment panel.
 * Props:
 * - familyCode: label for the family rail.
 * - processes: process list including optional process element.
 * - selectedProcessId: active process id.
 * - onSelectProcess/onToggleProcessStatus/onToggleEquipmentStatus: callbacks for interactions.
 * - onAddProcess/onAddEquipment: open creation flows.
 * - onEditProcessElement: opens edit flow for the process element card.
 * - onEditEquipment: opens edit flow for equipment elements.
 * State:
 * - none.
 * Side effects:
 * - useLayoutEffect: measures process card heights for panel clamping.
 * Rendering states:
 * - loading: n/a.
 * - error: n/a.
 * - empty: renders with no processes if list is empty.
 * - success: renders process rows and equipment panels.
 */
export default function ProcessBoard({
  familyCode,
  processes,
  selectedProcessId,
  onSelectProcess,
  onToggleProcessStatus,
  onToggleEquipmentStatus,
  onAddProcess,
  onAddEquipment,
  onEditProcessElement,
  onEditEquipment,
}: ProcessBoardProps) {
  const cardRefs = useRef(new Map<string, HTMLDivElement | null>());
  const [processHeights, setProcessHeights] = useState<Record<string, number>>(
    {}
  );
  const selectedProcess =
    processes.find((process) => process.id === selectedProcessId) ??
    processes[0];

  useLayoutEffect(() => {
    // Measure process card heights to clamp inactive equipment panels.
    const elements = Array.from(cardRefs.current.values()).filter(
      (element): element is HTMLDivElement => Boolean(element)
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
              <div className={styles.processColumn}>
                {/* Use a div wrapper to allow nested element cards inside the process block. */}
                <div
                  className={clsx(styles.processCard, {
                    [styles.processCardActive]: process.id === selectedProcess?.id,
                  })}
                  data-process-id={process.id}
                  data-testid={`process-card-${process.id}`}
                  ref={(element) => {
                    if (element) {
                      cardRefs.current.set(process.id, element);
                    } else {
                      cardRefs.current.delete(process.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
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

                  {/* Render the process-attached element inside the process card. */}
                  {process.element ? (
                    <div className={styles.processElement}>
                      <ProcessCharacteristicsCard
                        name={process.element.name}
                        status={process.element.status}
                        statusLabel={statusLabel[process.element.status]}
                        onClick={() => onSelectProcess(process.id)}
                        onEdit={() => onEditProcessElement(process.id)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Extracted equipment panel for reuse across the feature. */}
              <EquipmentPanel
                process={process}
                isSelected={isSelected}
                clampHeight={clampHeight}
                statusLabel={statusLabel}
                onAddEquipment={onAddEquipment}
                onSelectProcess={onSelectProcess}
                onToggleEquipmentStatus={onToggleEquipmentStatus}
                onEditEquipment={onEditEquipment}
              />
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
