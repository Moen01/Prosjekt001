import clsx from "clsx";
import type { MouseEvent } from "react";
import type { ProcessStatus } from "@lib/types/familyFmea";
import styles from "./cause-card.module.css";

/**
 * Cause card props for rendering a 5M element.
 */
interface CauseCardProps {
  /** Display name for the cause. */
  name: string;
  /** Status value for visual state styling. */
  status: ProcessStatus;
  /** Human-readable status label shown in the card. */
  statusLabel: string;
  /** Click handler for selecting or toggling the card. */
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  /** Click handler for opening the edit flow. */
  onEdit: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Whether the card is highlighted (e.g. linked to selected equipment). */
  isHighlighted?: boolean;
}

/**
 * Responsibility:
 * Render a single cause card with status styling and edit functionality.
 * Props:
 * - name: display name for the cause.
 * - status: status used for styling.
 * - statusLabel: label text shown under the name.
 * - onClick: handler for selection or status toggle.
 * - onEdit: handler for edit icon clicks.
 * - isHighlighted: whether to apply highlight styling.
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
export default function CauseCard({
  name,
  status,
  statusLabel,
  onClick,
  onEdit,
  isHighlighted,
}: CauseCardProps) {
  return (
    <div
      className={clsx(styles.card, {
        [styles.highlighted]: isHighlighted,
      })}
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <button
        type="button"
        className={styles.editButton}
        aria-label="Edit cause"
        onClick={(event) => {
          // Prevent edit icon clicks from toggling status.
          event.stopPropagation();
          onEdit(event);
        }}
        title="Edit cause"
      >
        ✎
      </button>
      <span className={styles.name}>{name}</span>
    </div>
  );
}
