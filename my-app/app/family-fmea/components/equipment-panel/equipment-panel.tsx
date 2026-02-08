"use client";

import { CSSProperties, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { createId } from "@lib/utils/id";
import type { Process, ProcessStatus } from "@lib/types/familyFmea";
import FiveMPanel from "../five-m-panel/five-m-panel";
import ProductCharacteristicsCard from "../product-characteristics-card/product-characteristics-card";
import styles from "./equipment-panel.module.css";

/**
 * Equipment panel inputs and callbacks for process-level equipment behavior.
 */
interface EquipmentPanelProps {
  /** Process owning the equipment entries shown in the panel. */
  process: Process;
  /** Whether the process row is active; inactive panels are faded and non-editable. */
  isSelected: boolean;
  /** Optional clamp height to prevent inactive panels overlapping other rows. */
  clampHeight?: number;
  /** Status display labels for each process status value. */
  statusLabel: Record<ProcessStatus, string>;
  /** Adds a new equipment entry for the given process id. */
  onAddEquipment: (processId: string) => void;
  /** Selects a process by id when a user focuses a faded panel. */
  onSelectProcess: (processId: string) => void;
  /** Toggles status for the given equipment entry. */
  onToggleEquipmentStatus: (processId: string, equipmentId: string) => void;
  /** Opens the edit flow for the given equipment entry. */
  onEditEquipment: (processId: string, equipmentId: string) => void;
  onAddFiveMIssue: (processId: string, label: string) => void;
  onToggleFiveMStatus: (
    processId: string,
    label: string,
    issueId: string
  ) => void;
  onEditFiveMIssue: (
    processId: string,
    label: string,
    issueId: string
  ) => void;
}

// 5M labels for the equipment-panel dropdown.
const EQUIPMENT_5M_LABELS = ["Man", "Machine", "Measure", "Milue", "Material"];

/**
 * Responsibility:
 * Render the equipment column for a single process, including 5M panel behavior.
 * Props:
 * - process: process data and equipment list.
 * - isSelected: controls active state vs. faded selection mode.
 * - clampHeight: optional height to clip inactive panels.
 * - statusLabel: labels for equipment status badges.
 * - onAddEquipment: callback for adding equipment.
 * - onSelectProcess: callback for activating a faded panel.
 * - onToggleEquipmentStatus: callback for status toggles.
 * - onEditEquipment: callback for editing equipment entries.
 * State:
 * - headerHeight: cached header height for sizing the 5M panel.
 * - panelOpen: whether the 5M panel is expanded.
 * - panelItems: per-5M-column items spawned by the user.
 * Side effects:
 * - useLayoutEffect: observes header size changes via ResizeObserver.
 * Rendering states:
 * - loading: n/a (pure client UI).
 * - error: n/a (no data fetch here).
 * - empty: handled by rendering zero equipment items.
 * - success: panel and equipment grid render.
 */
export default function EquipmentPanel({
  process,
  isSelected,
  clampHeight,
  statusLabel,
  onAddEquipment,
  onSelectProcess,
  onToggleEquipmentStatus,
  onEditEquipment,
  onAddFiveMIssue,
  onToggleFiveMStatus,
  onEditFiveMIssue,
}: EquipmentPanelProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [highlightedEquipmentId, setHighlightedEquipmentId] = useState<
    string | undefined
  >(undefined);

  useLayoutEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    /**
     * What it does:
     * Cache the header height to size the 5M panel.
     * Why it exists:
     * Keeps the panel height proportional even when the header resizes.
     *
     * @returns Void; updates local state.
     *
     * @throws None.
     * @sideEffects Updates component state.
     *
     * Edge cases:
     * - Uses a rounded pixel value to avoid layout jitter.
     */
    const updateHeight = () => {
      setHeaderHeight(Math.round(element.getBoundingClientRect().height));
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => updateHeight());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /**
   * What it does:
   * Toggle equipment status when the panel is active or select the process when inactive.
   * Why it exists:
   * Preserve the “click faded panel to activate” UX without losing status toggling.
   *
   * @param equipmentId - Target equipment id for status toggling.
   * @returns Void; triggers callbacks.
   *
   * @throws None.
   * @sideEffects Invokes selection or status toggle callbacks.
   *
   * Edge cases:
   * - Inactive panels ignore status toggles and only select the process.
   */
  const handleEquipmentClick = (equipmentId: string): void => {
    // Keep the selection behavior for faded panels.
    if (!isSelected) {
      onSelectProcess(process.id);
      return;
    }
    onToggleEquipmentStatus(process.id, equipmentId);
  };

  /**
   * What it does:
   * Toggle the 5M dropdown open state for the current process panel.
   * Why it exists:
   * Provide a single control to reveal or hide 5M sub-element columns.
   *
   * @returns Void; toggles internal state.
   *
   * @throws None.
   * @sideEffects Updates local component state.
   *
   * Edge cases:
   * - Keeps existing 5M items intact when collapsing.
   */
  const togglePanel = (): void => {
    // Track open state for the per-process 5M panel.
    setPanelOpen((prev) => !prev);
  };

  /**
   * What it does:
   * Append a new cause card under the requested 5M column.
   * Why it exists:
   * Users need to create cause cards per 5M category.
   *
   * @param label - 5M column label to append to.
   * @returns Void; updates local state.
   *
   * @throws None.
   * @sideEffects Updates local component state.
   *
   * Edge cases:
   * - Initializes the column array on first insert.
   */
  const addPanelItem = (label: string): void => {
    onAddFiveMIssue(process.id, label);
    // Keep the panel open when adding a new item.
    setPanelOpen(true);
  };

  /**
   * What it does:
   * Toggle cause status for the given 5M item.
   * Why it exists:
   * Users need to track status of cause cards.
   *
   * @param label - 5M column label.
   * @param causeId - Target cause id for status toggling.
   * @returns Void; updates local state.
   *
   * @throws None.
   * @sideEffects Updates local component state.
   *
   * Edge cases:
   * - Cycles through not_started -> in_progress -> completed -> not_started.
   */
  const toggleCauseStatus = (label: string, causeId: string): void => {
    onToggleFiveMStatus(process.id, label, causeId);
  };

  /**
   * What it does:
   * Opens the edit flow for the given cause card (placeholder for now).
   * Why it exists:
   * Users need to edit cause card details.
   *
   * @param label - 5M column label.
   * @param causeId - Target cause id for editing.
   * @returns Void; placeholder for future implementation.
   *
   * @throws None.
   * @sideEffects None (placeholder).
   *
   * Edge cases:
   * - Will be implemented with modal in future.
   */
  const editCause = (label: string, causeId: string): void => {
    onEditFiveMIssue(process.id, label, causeId);
  };

  // data-testid supports panel-selection tests.
  return (
    <div
      className={clsx(styles.equipmentPanel, {
        [styles.equipmentPanelInactive]: !isSelected,
      })}
      data-testid={`equipment-panel-${process.id}`}
      style={
        !isSelected && clampHeight
          ? ({ "--equipment-clamp-height": `${clampHeight}px` } as CSSProperties)
          : undefined
      }
      onClick={() => {
        // Allow activating the process by clicking the faded panel background.
        if (!isSelected) {
          onSelectProcess(process.id);
        } else {
          // Clear highlight on background click
          setHighlightedEquipmentId(undefined);
        }
      }}
    >
      <div className={styles.equipmentHeader} ref={headerRef}>
        <div>
          <p className={styles.equipmentKicker}>Equipment</p>
          <h3 className={styles.equipmentTitle}>{process.name}</h3>
        </div>
        {/* data-testid supports add-element button targeting in tests. */}
        <button
          type="button"
          className={styles.addEquipment}
          onClick={(e) => {
            e.stopPropagation(); // Prevent clearing highlight
            onAddEquipment(process.id);
          }}
          disabled={!isSelected}
          data-testid={`equipment-add-element-${process.id}`}
        >
          Add element
        </button>
      </div>

      <div className={styles.equipmentGrid}>
        {process.equipment.map((equipment) => (
          <ProductCharacteristicsCard
            key={equipment.id}
            name={equipment.name}
            status={equipment.status}
            statusLabel={statusLabel[equipment.status]}
            onClick={(event) => {
              // Prevent panel click from double-firing on equipment cards.
              event.stopPropagation();
              handleEquipmentClick(equipment.id);
            }}
            onEdit={(e) => {
              e.stopPropagation();
              onEditEquipment(process.id, equipment.id);
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!isSelected) return;
              setHighlightedEquipmentId((prev) =>
                prev === equipment.id ? undefined : equipment.id
              );
            }}
            isHighlighted={highlightedEquipmentId === equipment.id}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.equipment5mToggle}
        onClick={(e) => {
          e.stopPropagation();
          togglePanel();
        }}
        disabled={!isSelected}
      >
        5M
      </button>

      {panelOpen ? (
        <FiveMPanel
          labels={EQUIPMENT_5M_LABELS}
          items={process.fiveMIssues ?? {}}
          headerHeight={headerHeight}
          statusLabel={statusLabel}
          onAddItem={addPanelItem}
          onToggleCauseStatus={toggleCauseStatus}
          onEditCause={editCause}
          highlightedEquipmentId={highlightedEquipmentId}
        />
      ) : null}
    </div>
  );
}
