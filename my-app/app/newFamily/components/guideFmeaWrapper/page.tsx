'use client';

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type { ChecklistState, GuideStep, StatusColor } from "@lib/types/fmea";
import GuideFmea from "../guideFmea/page";

interface GuideFmeaWrapperProps {
  onAllChecked?: (stepIndex: number) => void;
  onStatusChange?: (status: StatusColor[]) => void;
}

export interface GuideFmeaWrapperHandle {
  setCurrentStepYellow: () => void;
  reset: () => void;
}

const initialSteps: GuideStep[] = [
  {
    id: 1,
    title: "Understand the baseline",
    description: "Review the current process documentation and confirm scope.",
    checklist: [
      { id: "ac1", label: "AC1", checked: false },
      { id: "ac2", label: "AC2", checked: false },
      { id: "ac3", label: "AC3", checked: false },
    ],
  },
  {
    id: 2,
    title: "Capture feasibility inputs",
    description: "Collect all feasibility assessments and stakeholder approvals.",
    checklist: [
      { id: "ac1", label: "AC1", checked: false },
      { id: "ac2", label: "AC2", checked: false },
      { id: "ac3", label: "AC3", checked: false },
    ],
  },
  {
    id: 3,
    title: "Finalize Family FMEA",
    description: "Validate the mitigation plan and confirm readiness for release.",
    checklist: [
      { id: "ac1", label: "AC1", checked: false },
      { id: "ac2", label: "AC2", checked: false },
      { id: "ac3", label: "AC3", checked: false },
    ],
  },
];

function deriveChecklistMatrix(steps: GuideStep[]) {
  return steps.map((step) => step.checklist.map((item) => item.checked));
}

const defaultStatus = (length: number): StatusColor[] =>
  Array.from({ length }, () => "red" as StatusColor);

const GuideFmeaWrapper = forwardRef<GuideFmeaWrapperHandle, GuideFmeaWrapperProps>(
  ({ onAllChecked, onStatusChange }, ref) => {
    const steps = useMemo(() => initialSteps, []);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [checklists, setChecklists] = useState<boolean[][]>(
      () => deriveChecklistMatrix(steps)
    );
    const [statusColors, setStatusColors] = useState<StatusColor[]>(() =>
      defaultStatus(steps.length)
    );

    const emitStatusChange = useCallback(
      (nextStatus: StatusColor[]) => {
        setStatusColors(nextStatus);
        onStatusChange?.(nextStatus);
      },
      [onStatusChange]
    );

    const handlePrev = () =>
      setActiveStepIndex((prev) => Math.max(0, prev - 1));

    const handleNext = () =>
      setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1));

    const handleCheck = useCallback(
      (checkIndex: number) => {
        setChecklists((prev) => {
          const copy = prev.map((row) => [...row]);
          copy[activeStepIndex][checkIndex] = !copy[activeStepIndex][checkIndex];

          if (copy[activeStepIndex].every(Boolean)) {
            const nextStatus = [...statusColors];
            nextStatus[activeStepIndex] = "green";
            emitStatusChange(nextStatus);
            onAllChecked?.(activeStepIndex);
          }

          return copy;
        });
      },
      [activeStepIndex, emitStatusChange, onAllChecked, statusColors]
    );

    const setCurrentStepYellow = useCallback(() => {
      setStatusColors((prev) => {
        const next = [...prev];
        if (next[activeStepIndex] !== "green") {
          next[activeStepIndex] = "yellow";
          onStatusChange?.(next);
        }
        return next;
      });
    }, [activeStepIndex, onStatusChange]);

    const reset = useCallback(() => {
      setChecklists(deriveChecklistMatrix(steps));
      const resetStatus = defaultStatus(steps.length);
      setStatusColors(resetStatus);
      onStatusChange?.(resetStatus);
      setActiveStepIndex(0);
    }, [steps, onStatusChange]);

    useImperativeHandle(
      ref,
      () => ({
        setCurrentStepYellow,
        reset,
      }),
      [setCurrentStepYellow, reset]
    );

    return (
      <GuideFmea
        step={activeStepIndex + 1}
        totalSteps={steps.length}
        text={steps[activeStepIndex].description}
        acStates={checklists[activeStepIndex]}
        onCheck={handleCheck}
        onPrev={handlePrev}
        onNext={handleNext}
        statusColors={statusColors}
      />
    );
  }
);

GuideFmeaWrapper.displayName = "GuideFmeaWrapper";

export default GuideFmeaWrapper;
