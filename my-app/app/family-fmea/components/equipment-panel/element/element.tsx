import clsx from "clsx";
import type { MouseEvent } from "react";
import type { ProcessStatus } from "@lib/types/familyFmea";
import styles from "./element.module.css";

/**
 * Equipment element props for rendering a clickable equipment card.
 */
interface ElementProps {
  /** Display name for the equipment entry. */
  name: string;
  /** Status value for visual state styling. */
  status: ProcessStatus;
  /** Human-readable status label shown in the card. */
  statusLabel: string;
  /** Click handler for selecting or toggling the equipment entry. */
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  /** Click handler for opening the edit flow. */
  onEdit: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Responsibility:
 * Render a single equipment card with status styling and click handling.
 * Props:
 * - name: display name for the equipment.
 * - status: equipment status used for styling.
 * - statusLabel: label text shown under the name.
 * - onClick: handler for selection or status toggle.
 * - onEdit: handler for edit icon clicks.
 * State:
 * - none.
 * Side effects:
 * - none.
 * Rendering states:
 * - loading: n/a.
 * - error: n/a.
 * - empty: n/a (caller decides).
 * - success: renders a clickable card with an edit icon.
 */
export default function Element({
  name,
  status,
  statusLabel,
  onClick,
  onEdit,
}: ElementProps) {
  return (
    <div
      className={clsx(styles.card, styles[`status${status}`])}
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <button
        type="button"
        className={styles.editButton}
        aria-label="Edit element"
        onClick={(event) => {
          // Prevent edit icon clicks from toggling equipment status.
          event.stopPropagation();
          onEdit(event);
        }}
        title="Edit element"
      >
        ✎
      </button>
      <span className={styles.name}>{name}</span>
      <span className={styles.status}>{statusLabel}</span>
    </div>
  );
}
