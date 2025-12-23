import { useFmeaFamilyKort } from "../../../../contexts/FmeaFamilyKortContext";
import styles from "./fmeaFamilyKortLeftPane.module.css";

export default function FmeaFamilyKortLeftPane() {
  const { showFmeaFamilyKort } = useFmeaFamilyKort();

  if (!showFmeaFamilyKort) {
    return null;
  }

  return <div className={styles.badge}>Kort</div>;
}
