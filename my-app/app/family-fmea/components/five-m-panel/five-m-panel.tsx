import type { CSSProperties } from "react";
import SubElement from "../equipment-panel/sub-element/sub-element";
import styles from "./five-m-panel.module.css";

/**
 * Single 5M column item definition for the panel.
 */
interface FiveMPanelItem {
  /** Unique identifier for rendering stability. */
  id: string;
  /** Label displayed inside the sub-element card. */
  label: string;
}

/**
 * 5M panel props for rendering selectable columns and sub-elements.
 */
interface FiveMPanelProps {
  /** The label list that renders the top-row buttons. */
  labels: string[];
  /** Map of labels to sub-element entries for each column. */
  items: Record<string, FiveMPanelItem[]>;
  /** Header height used to size the panel (in pixels). */
  headerHeight: number;
  /** Click handler to append a sub-element to a label column. */
  onAddItem: (label: string) => void;
}

/**
 * Responsibility:
 * Render the 5M panel with a horizontal row of buttons and per-column sub-elements.
 * Props:
 * - labels: button labels for 5M categories.
 * - items: per-label sub-element entries.
 * - headerHeight: used to set the panel height.
 * - onAddItem: handler for spawning new sub-elements.
 * State:
 * - none.
 * Side effects:
 * - none.
 * Rendering states:
 * - loading: n/a.
 * - error: n/a.
 * - empty: renders buttons with no sub-elements.
 * - success: renders buttons and sub-elements.
 */
export default function FiveMPanel({
  labels,
  items,
  headerHeight,
  onAddItem,
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
                <SubElement key={item.id} label={item.label} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
