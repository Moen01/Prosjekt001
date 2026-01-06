"use client";

import { useEffect, useMemo, useState } from "react";
import { createId } from "@lib/utils/id";
import { fetchFamilies, fetchFamilyOverview } from "@lib/api/familyFmea";
import type { FamilyFmeaOverview, Process, ProcessStatus } from "@lib/types/familyFmea";
import ProcessBoard from "../process-board/process-board";
import styles from "./family-fmea.module.css";

interface FamilyFmeaClientProps {
  initialFamilyId?: string;
  initialFamilyCode?: string;
}

type StepStatus = ProcessStatus;

const deriveStepStatus = (criteria: boolean[]): StepStatus => {
  if (criteria.every(Boolean)) {
    return "completed";
  }
  if (criteria.some(Boolean)) {
    return "in_progress";
  }
  return "not_started";
};

// Client-side Family FMEA flow state and data binding.
export default function FamilyFmeaClient({
  initialFamilyId,
  initialFamilyCode,
}: FamilyFmeaClientProps) {
  const [overview, setOverview] = useState<FamilyFmeaOverview | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [criteriaState, setCriteriaState] = useState<boolean[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const families = await fetchFamilies();
        if (!isMounted) return;
        const selectedFamily =
          families.find((family) => family.id === initialFamilyId) ??
          families.find(
            (family) =>
              initialFamilyCode &&
              family.code.toLowerCase() === initialFamilyCode.toLowerCase()
          ) ??
          families[0];

        if (!selectedFamily) {
          throw new Error("No family data available");
        }

        const nextOverview = await fetchFamilyOverview(selectedFamily.id);
        if (!isMounted) return;

        setOverview(nextOverview);
        setProcesses(nextOverview.processes);
        setSelectedProcessId(nextOverview.processes[0]?.id ?? null);
        setCriteriaState(
          nextOverview.steps.map((step) =>
            step.acceptanceCriteria.map(() => false)
          )
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [initialFamilyCode, initialFamilyId]);

  const stepStatuses = useMemo(() => {
    if (!overview) return [];
    return criteriaState.map(deriveStepStatus);
  }, [criteriaState, overview]);

  const handleToggleProcessStatus = (processId: string) => {
    setProcesses((prev) =>
      prev.map((process) => {
        if (process.id !== processId) return process;
        const nextStatus: ProcessStatus =
          process.status === "not_started"
            ? "in_progress"
            : process.status === "in_progress"
            ? "completed"
            : "not_started";
        return { ...process, status: nextStatus };
      })
    );
  };

  const handleToggleEquipmentStatus = (processId: string, equipmentId: string) => {
    setProcesses((prev) =>
      prev.map((process) => {
        if (process.id !== processId) return process;
        return {
          ...process,
          equipment: process.equipment.map((item) => {
            if (item.id !== equipmentId) return item;
            const nextStatus: ProcessStatus =
              item.status === "not_started"
                ? "in_progress"
                : item.status === "in_progress"
                ? "completed"
                : "not_started";
            return { ...item, status: nextStatus };
          }),
        };
      })
    );
  };

  const handleAddProcess = () => {
    if (!overview) return;
    const newProcess: Process = {
      id: createId(),
      productionLineId: overview.productionLine.id,
      name: `New process ${processes.length + 1}`,
      status: "not_started",
      notes: "Add notes or key actions for this process.",
      equipment: [
        { id: createId(), name: "Quality controls", status: "not_started" },
        { id: createId(), name: "Preventive maintenance", status: "not_started" },
      ],
    };

    setProcesses((prev) => [...prev, newProcess]);
    setSelectedProcessId(newProcess.id);
  };

  const handleAddEquipment = (processId: string) => {
    setProcesses((prev) =>
      prev.map((process) => {
        if (process.id !== processId) return process;
        return {
          ...process,
          equipment: [
            ...process.equipment,
            {
              id: createId(),
              name: `New element ${process.equipment.length + 1}`,
              status: "not_started",
            },
          ],
        };
      })
    );
  };

  const handleToggleCriteria = (stepIndex: number, criteriaIndex: number) => {
    setCriteriaState((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex !== stepIndex
          ? row
          : row.map((value, valueIndex) =>
              valueIndex === criteriaIndex ? !value : value
            )
      )
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading Family FMEA…</div>;
  }

  if (error || !overview) {
    return (
      <div className={styles.error}>
        {error ?? "Unable to load Family FMEA"}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Family FMEA</p>
          <h1 className={styles.title}>{overview.family.name}</h1>
          <p className={styles.subtitle}>{overview.productionLine.name}</p>
        </div>
      </header>

      <div className={styles.grid}>
        <ProcessBoard
          familyCode={overview.family.code}
          processes={processes}
          selectedProcessId={selectedProcessId}
          onSelectProcess={setSelectedProcessId}
          onToggleProcessStatus={handleToggleProcessStatus}
          onToggleEquipmentStatus={handleToggleEquipmentStatus}
          onAddProcess={handleAddProcess}
          onAddEquipment={handleAddEquipment}
        />
      </div>
    </div>
  );
}
