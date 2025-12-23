import type { Metadata } from "next";
import ButtonNavigering from "../../components/buttonNavigering/page";
import Box from "../../components/box/page";
import styles from "./product.module.css";

export const metadata: Metadata = {
  title: "Product Portfolio",
};

export default function ProductPage() {
  return (
    <div className={styles.openProsjekt}>
      <div className={styles.boxContainer}>
        <Box>
          <ButtonNavigering route="/ProjectManagment" label="Tilbake" />
        </Box>
      </div>
    </div>
  );
}
