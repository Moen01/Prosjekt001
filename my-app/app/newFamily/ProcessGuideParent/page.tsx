'use client';

import { useRef } from "react";
import InitsielFmeaProsess from "../components/initsielFmeaProcses/page";
import GuideFmeaWrapper, {
  type GuideFmeaWrapperHandle,
} from "../components/guideFmeaWrapper/page";

export default function ProcessGuideParent() {
  const guideRef = useRef<GuideFmeaWrapperHandle>(null);

  return (
    <div style={{ position: "relative", padding: "1rem" }}>
      <InitsielFmeaProsess
        title="Family FMEA"
        onProcessAdded={() => guideRef.current?.setCurrentStepYellow()}
      />
      <GuideFmeaWrapper ref={guideRef} />
    </div>
  );
}
