import clsx from "clsx";
import type { MouseEvent } from "react";
import type { ProcessStatus } from "@lib/types/familyFmea";
import styles from "./product-characteristics-card.module.css";

/**
 * Product characteristics card props for rendering an equipment element.
 */
interface ProductCharacteristicsCardProps {
  /** Display name for the product characteristics. */
  name: string;
  /** Status value for visual state styling. */
  status: ProcessStatus;
  /** Human-readable status label shown in the card. */
  statusLabel: string;
  /** Click handler for selecting or toggling the card. */
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  /** Click handler for opening the edit flow. */
  /** Click handler for opening the edit flow. */
  onEdit: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Context menu handler for highlighting linked items. */
  onContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Whether the card is selected for 5M highlighting. */
  isHighlighted?: boolean;
}

/**
 * Responsibility:
 * Render a single product characteristics card with status styling and edit functionality.
 * Props:
 * - name: display name for the product characteristics.
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
export default function ProductCharacteristicsCard({
  name,
  status,
  statusLabel,
  onClick,
  onEdit,
  onContextMenu,
  isHighlighted,
}: ProductCharacteristicsCardProps) {
  return (
    <div
      className={clsx(styles.card, {
        [styles.highlighted]: isHighlighted,
      })}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <button
        type="button"
        className={styles.editButton}
        aria-label="Edit product characteristics"
        onClick={(event) => {
          // Prevent edit icon clicks from toggling status.
          event.stopPropagation();
          onEdit(event);
        }}
        title="Edit product characteristics"
      >
        ✎
      </button>
      <span className={styles.name}>{name}</span>
    </div>
  );
}
