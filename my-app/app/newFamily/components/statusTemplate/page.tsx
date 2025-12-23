import type { StatusColor } from "@lib/types/fmea";
import styles from "./statusTemplate.module.css";

interface StatusTemplateProps {
  statusColors: StatusColor[];
}

const colorLabels: Record<StatusColor, string> = {
  red: "Not started",
  yellow: "In work",
  green: "Completed",
};

export default function StatusTemplate({
  statusColors,
}: StatusTemplateProps) {
  return (
    <aside className={styles.statusTemplate} aria-live="polite">
      <span className={styles.header}>Guide status</span>
      <div className={styles.statusContent}>
        {statusColors.map((color, index) => (
          <div key={index} className={styles.statusRow}>
            <span
              className={styles.statusBadge}
              style={{ background: color }}
              aria-hidden="true"
            />
            <span className={styles.statusLabel}>
              Step {index + 1}: {colorLabels[color]}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
