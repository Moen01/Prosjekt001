import clsx from "clsx";
import type { MouseEvent } from "react";
import type { ProcessStatus } from "@lib/types/familyFmea";
import styles from "./process-characteristics-card.module.css";

/**
 * Process characteristics card props for rendering a process element.
 */
interface ProcessCharacteristicsCardProps {
  /** Display name for the process characteristics. */
  name: string;
  /** Status value for visual state styling. */
  status: ProcessStatus;
  /** Human-readable status label shown in the card. */
  statusLabel: string;
  /** Click handler for selecting or toggling the card. */
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  /** Click handler for opening the edit flow. */
  onEdit: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Responsibility:
 * Render a single process characteristics card with status styling and edit functionality.
 * Props:
 * - name: display name for the process characteristics.
 * - status: status used for styling.
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
export default function ProcessCharacteristicsCard({
  name,
  status,
  statusLabel,
  onClick,
  onEdit,
}: ProcessCharacteristicsCardProps) {
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
        aria-label="Edit process characteristics"
        onClick={(event) => {
          // Prevent edit icon clicks from toggling status.
          event.stopPropagation();
          onEdit(event);
        }}
        title="Edit process characteristics"
      >
        ✎
      </button>
      <span className={styles.name}>{name}</span>
      <span className={styles.status}>{statusLabel}</span>
    </div>
  );
}
