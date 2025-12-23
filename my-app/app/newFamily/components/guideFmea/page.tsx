'use client';

import { Fragment, useState } from "react";
import type { StatusColor } from "@lib/types/fmea";
import styles from "./guideFmea.module.css";

interface GuideFmeaProps {
  step: number;
  totalSteps: number;
  text: string;
  acStates: boolean[];
  onCheck: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  statusColors: StatusColor[];
}

export default function GuideFmea({
  step,
  totalSteps,
  text,
  acStates,
  onCheck,
  onPrev,
  onNext,
  statusColors,
}: GuideFmeaProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${styles.guideFmeaContainer} ${collapsed ? styles.collapsed : ""}`}
    >
      <button
        className={styles.guideFmeaCollapseArrow}
        onClick={() => setCollapsed((current) => !current)}
        aria-label={collapsed ? "Expand guide" : "Collapse guide"}
        title={collapsed ? "Expand" : "Collapse"}
        type="button"
      >
        {collapsed ? "←" : "→"}
      </button>

      {!collapsed && (
        <>
          <div className={styles.guideFmeaTextbox}>
            <textarea value={text} readOnly className={styles.guideFmeaTextarea} />
          </div>
          <div className={styles.guideFmeaRight}>
            <div className={styles.guideFmeaStep}>
              Step {step} of {totalSteps}
            </div>
            <div className={styles.guideFmeaAcRow}>
              {["AC1", "AC2", "AC3"].map((ac, index) => (
                <Fragment key={ac}>
                  <span>{ac}</span>
                  <button
                    type="button"
                    className={`${styles.guideFmeaCheck} ${acStates[index] ? styles.guideFmeaCheckChecked : ""}`}
                    onClick={() => onCheck(index)}
                    aria-label={`Check ${ac}`}
                  >
                    {acStates[index] ? "✓" : ""}
                  </button>
                </Fragment>
              ))}
            </div>
            <div className={styles.guideFmeaArrows}>
              <button
                type="button"
                className={styles.guideFmeaArrow}
                onClick={onPrev}
                aria-label="Previous"
              >
                &#8592;
              </button>
              <button
                type="button"
                className={styles.guideFmeaArrow}
                onClick={onNext}
                aria-label="Next"
              >
                &#8594;
              </button>
            </div>
          </div>
        </>
      )}
      <div className={styles.guideFmeaStatusStack}>
        {statusColors.map((color, index) => (
          <div
            key={index}
            className={styles.guideFmeaStatusBox}
            style={{ background: color }}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
