import type { Metadata } from "next";
import ButtonNavigering from "../components/buttonNavigering/page";
import Box from "../components/box/page";
import SplitterVertically from "../components/splitterVertically/page";
import styles from "./ProjectManagment.module.css";

export const metadata: Metadata = {
  title: "Project Management",
};

export default function ProjectManagementPage() {
  return (
    <div className={styles.projectManagement}>
      <div className={styles.contentContainer}>
        <Box>
          <ButtonNavigering
            route="/ProjectManagment/product"
            label="Product"
          />
        </Box>
        <SplitterVertically />
        <Box>
          <ButtonNavigering
            route="/ProjectManagment/familyFMEA"
            label="Family FMEA"
          />
        </Box>
      </div>
    </div>
  );
}
