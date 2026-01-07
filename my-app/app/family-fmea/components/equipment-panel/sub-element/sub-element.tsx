import styles from "./sub-element.module.css";

/**
 * Sub-element props for a 5M column item.
 */
interface SubElementProps {
  /** Label displayed inside the sub-element card. */
  label: string;
}

/**
 * Responsibility:
 * Render a sub-element card for a 5M column.
 * Props:
 * - label: display text for the sub-element.
 * State:
 * - none.
 * Side effects:
 * - none.
 * Rendering states:
 * - loading: n/a.
 * - error: n/a.
 * - empty: n/a (caller decides).
 * - success: renders a simple label block.
 */
export default function SubElement({ label }: SubElementProps) {
  return <div className={styles.item}>{label}</div>;
}
