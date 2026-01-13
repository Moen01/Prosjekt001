import type { CSSProperties } from "react";
import type { ProcessStatus } from "@lib/types/familyFmea";
import CauseCard from "../cause-card/cause-card";
import styles from "./five-m-panel.module.css";

/**
 * Single 5M column item definition for the panel.
 */
interface FiveMPanelItem {
  /** Unique identifier for rendering stability. */
  id: string;
  /** Label displayed inside the cause card. */
  label: string;
  /** Status value for visual state styling. */
  status: ProcessStatus;
}

/**
 * 5M panel props for rendering selectable columns and cause cards.
 */
interface FiveMPanelProps {
  /** The label list that renders the top-row buttons. */
  labels: string[];
  /** Map of labels to cause card entries for each column. */
  items: Record<string, FiveMPanelItem[]>;
  /** Header height used to size the panel (in pixels). */
  headerHeight: number;
  /** Status display labels for each process status value. */
  statusLabel: Record<ProcessStatus, string>;
  /** Click handler to append a cause card to a label column. */
  onAddItem: (label: string) => void;
  /** Toggles status for the given cause item. */
  onToggleCauseStatus: (label: string, causeId: string) => void;
  /** Opens the edit flow for the given cause item. */
  onEditCause: (label: string, causeId: string) => void;
}

/**
 * Responsibility:
 * Render the 5M panel with a horizontal row of buttons and per-column cause cards.
 * Props:
 * - labels: button labels for 5M categories.
 * - items: per-label cause card entries.
 * - headerHeight: used to set the panel height.
 * - statusLabel: labels for cause status badges.
 * - onAddItem: handler for spawning new cause cards.
 * - onToggleCauseStatus: callback for status toggles.
 * - onEditCause: callback for editing cause entries.
 * State:
 * - none.
 * Side effects:
 * - none.
 * Rendering states:
 * - loading: n/a.
 * - error: n/a.
 * - empty: renders buttons with no cause cards.
 * - success: renders buttons and cause cards.
 */
export default function FiveMPanel({
  labels,
  items,
  headerHeight,
  statusLabel,
  onAddItem,
  onToggleCauseStatus,
  onEditCause,
}: FiveMPanelProps) {
  // data-testid supports panel layout tests.
  return (
    <div
      className={styles.panel}
      data-testid="five-m-panel"
      style={
        headerHeight
          ? ({ "--equipment-header-height": `${headerHeight}px` } as CSSProperties)
          : undefined
      }
    >
      <div className={styles.buttons}>
        {labels.map((label) => (
          <div key={label} className={styles.column}>
            <button
              type="button"
              className={styles.button}
              onClick={() => onAddItem(label)}
            >
              {label}
            </button>
            <div className={styles.items}>
              {(items[label] ?? []).map((item) => (
                <CauseCard
                  key={item.id}
                  name={item.label}
                  status={item.status}
                  statusLabel={statusLabel[item.status]}
                  onClick={() => onToggleCauseStatus(label, item.id)}
                  onEdit={() => onEditCause(label, item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
