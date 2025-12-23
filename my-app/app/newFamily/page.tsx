'use client';

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { StatusColor } from "@lib/types/fmea";
import InitsielFmeaProsess from "./components/initsielFmeaProcses/page";
import BoksModell from "../leftPane/boksModell/page";
import StatusTemplate from "./components/statusTemplate/page";
import GuideFmeaWrapper, {
  type GuideFmeaWrapperHandle,
} from "./components/guideFmeaWrapper/page";
import styles from "./newFamily.module.css";

export default function NewFamilyPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "Family FMEA";
  const guideRef = useRef<GuideFmeaWrapperHandle>(null);
  const [statusColors, setStatusColors] = useState<StatusColor[]>([
    "red",
    "red",
    "red",
  ]);

  return (
    <div className={styles.newFamilyFlex}>
      <aside className={styles.leftPane}>
        <BoksModell />
      </aside>
      <main className={styles.rightPane}>
        <div className={styles.statusTemplateFixed}>
          <StatusTemplate statusColors={statusColors} />
        </div>
        <InitsielFmeaProsess
          title={title}
          onProcessAdded={() => guideRef.current?.setCurrentStepYellow()}
        />
        <GuideFmeaWrapper
          ref={guideRef}
          onStatusChange={setStatusColors}
        />
      </main>
    </div>
  );
}
