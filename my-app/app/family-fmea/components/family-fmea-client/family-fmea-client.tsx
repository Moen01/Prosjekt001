"use client";

import { useEffect, useMemo, useState } from "react";
import { createId } from "@lib/utils/id";
import { fetchFamilies, fetchFamilyOverview } from "@lib/api/familyFmea";
import type {
  ElementDetails,
  FamilyFmeaOverview,
  Process,
  ProcessStatus,
  FiveMItem,
} from "@lib/types/familyFmea";
import ProcessBoard from "../process-board/process-board";
import CreateItemModal, {
  type CreateItemInitialValues,
  type CreateItemPayload,
} from "../create-item-modal/create-item-modal";
import FiveMDetailModal from "../five-m-detail-modal/five-m-detail-modal";
import styles from "./family-fmea.module.css";

interface FamilyFmeaClientProps {
  initialFamilyId?: string;
  initialFamilyCode?: string;
}

type StepStatus = ProcessStatus;

/**
 * What it does:
 * Derive a step status based on acceptance criteria toggles.
 * Why it exists:
 * Keep a single source of truth for step progress display.
 *
 * @param criteria - Boolean flags for each acceptance criterion.
 * @returns The derived step status label.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - Empty criteria returns "not_started".
 */
const deriveStepStatus = (criteria: boolean[]): StepStatus => {
  if (criteria.every(Boolean)) {
    return "completed";
  }
  if (criteria.some(Boolean)) {
    return "in_progress";
  }
  return "not_started";
};

/**
 * What it does:
 * Trim and drop empty detail values from the create modal.
 * Why it exists:
 * Avoid persisting empty strings as meaningful data.
 *
 * @param details - Raw detail field values from the modal.
 * @returns Sanitized detail object with empty values removed.
 *
 * @throws None.
 * @sideEffects None.
 *
 * Edge cases:
 * - All empty inputs returns an empty object.
 */
const normalizeDetails = (details: ElementDetails): ElementDetails => {
  const nextDetails: ElementDetails = {};
  const feasability = details.feasability?.trim();
  const fmea = details.fmea?.trim();
  const inspection = details.inspection?.trim();
  const sc = details.sc?.trim();

  if (feasability) nextDetails.feasability = feasability;
  if (fmea) nextDetails.fmea = fmea;
  if (inspection) nextDetails.inspection = inspection;
  if (sc) nextDetails.sc = sc;

  return nextDetails;
};

/**
 * Internal modal state for creating processes or equipment entries.
 */
type CreateModalState =
  | { mode: "process" }
  | { mode: "equipment"; processId: string }
  | { mode: "family" };

/**
 * Internal modal state for editing existing elements.
 */
type EditModalState =
  | { mode: "family"; initialValues: CreateItemInitialValues }
  | { mode: "equipment"; processId: string; elementId: string; initialValues: CreateItemInitialValues }
  | { mode: "process-element"; processId: string; initialValues: CreateItemInitialValues };

interface FiveMEditState {
  processId: string;
  label: string;
  issueId: string;
  currentDetails: string;
  currentLinkedId?: string;
  availableEquipment?: { id: string; name: string }[];
}

/**
 * Family-level element created from the header panel.
 */
interface FamilyElement {
  /** Unique identifier for the family element. */
  id: string;
  /** Display label for the family element. */
  name: string;
  /** Optional details captured in the create modal. */
  details: ElementDetails;
}

// Client-side Family FMEA flow state and data binding.
/**
 * Responsibility:
 * Load Family FMEA data and coordinate process/equipment UI state.
 * Props:
 * - initialFamilyId: optional family id for initial selection.
 * - initialFamilyCode: optional family code or title for initial selection.
 * State:
 * - overview/processes/selectedProcessId: loaded data and selection state.
 * - criteriaState: step acceptance toggles for guide status.
 * - createModal: modal state for process/equipment/family creation.
 * - editModal: modal state for editing existing elements.
 * - familyElements: single header-level element attached to the family title.
 * - isLoading/error: async UI state for data loading.
 * Side effects:
 * - useEffect: fetches families and overview data.
 * Rendering states:
 * - loading: shows loading label.
 * - error: shows error label.
 * - empty: handled by error when no data exists.
 * - success: renders the Family FMEA board.
 */
export default function FamilyFmeaClient({
  initialFamilyId,
  initialFamilyCode,
}: FamilyFmeaClientProps) {
  const [overview, setOverview] = useState<FamilyFmeaOverview | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [criteriaState, setCriteriaState] = useState<boolean[][]>([]);
  const [createModal, setCreateModal] = useState<CreateModalState | null>(null);
  const [editModal, setEditModal] = useState<EditModalState | null>(null);
  const [fiveMEditModal, setFiveMEditModal] = useState<FiveMEditState | null>(
    null
  );
  const [familyElements, setFamilyElements] = useState<FamilyElement[]>([]);
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

  /**
   * What it does:
   * Cycle the status for the specified process.
   * Why it exists:
   * Keeps process status updates consistent across the board.
   *
   * @param processId - Process id to update.
   * @returns Void; updates state.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - Unknown ids are ignored.
   */
  const handleToggleProcessStatus = (processId: string): void => {
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

  /**
   * What it does:
   * Cycle the status for a single equipment entry.
   * Why it exists:
   * Aligns equipment status changes with process status behavior.
   *
   * @param processId - Process id that owns the equipment.
   * @param equipmentId - Equipment id to update.
   * @returns Void; updates state.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - Unknown ids are ignored.
   */
  const handleToggleEquipmentStatus = (
    processId: string,
    equipmentId: string
  ): void => {
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

  /**
   * What it does:
   * Open the create modal for a new process.
   * Why it exists:
   * Process creation now requires naming and element details.
   *
   * @returns Void; opens the modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - If overview is missing, the modal still opens; submission is guarded.
   */
  const handleRequestAddProcess = (): void => {
    setEditModal(null);
    setCreateModal({ mode: "process" });
  };

  /**
   * What it does:
   * Open the create modal for a new equipment entry.
   * Why it exists:
   * Equipment creation now uses the shared modal flow.
   *
   * @param processId - Process id that will receive the equipment.
   * @returns Void; opens the modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   */
  const handleRequestAddEquipment = (processId: string): void => {
    setEditModal(null);
    setCreateModal({ mode: "equipment", processId });
  };

  /**
   * Adds a new 5M issue to the specified process under the given label (Man/Machine/etc.).
   */
  const handleAddFiveMIssue = (processId: string, label: string): void => {
    setProcesses((prev) =>
      prev.map((process) => {
        if (process.id !== processId) return process;
        const currentIssues = process.fiveMIssues?.[label] ?? [];
        const newItem: FiveMItem = {
          id: createId(),
          label: `${label} element ${currentIssues.length + 1}`,
          status: "not_started",
        };
        return {
          ...process,
          fiveMIssues: {
            ...process.fiveMIssues,
            [label]: [...currentIssues, newItem],
          },
        };
      })
    );
  };

  /**
   * Toggles the status of a 5M issue.
   */
  const handleToggleFiveMStatus = (
    processId: string,
    label: string,
    issueId: string
  ): void => {
    setProcesses((prev) =>
      prev.map((process) => {
        if (process.id !== processId) return process;
        const currentIssues = process.fiveMIssues?.[label] ?? [];
        return {
          ...process,
          fiveMIssues: {
            ...process.fiveMIssues,
            [label]: currentIssues.map((item) => {
              if (item.id !== issueId) return item;
              const statusCycle: ProcessStatus[] = [
                "not_started",
                "in_progress",
                "completed",
              ];
              const currentIndex = statusCycle.indexOf(item.status);
              const nextStatus =
                statusCycle[(currentIndex + 1) % statusCycle.length];
              return { ...item, status: nextStatus };
            }),
          },
        };
      })
    );
  };

  const handleEditFiveMIssue = (
    processId: string,
    label: string,
    issueId: string
  ): void => {
    const process = processes.find((p) => p.id === processId);
    const item = process?.fiveMIssues?.[label]?.find((i) => i.id === issueId);
    if (!process || !item) return;

    setFiveMEditModal({
      processId,
      label,
      issueId,
      currentDetails: item.details ?? "",
      currentLinkedId: item.linkedEquipmentId,
      availableEquipment: process.equipment.map((e) => ({
        id: e.id,
        name: e.name,
      })),
    });
  };

  const handleFiveMSubmit = (
    details: string,
    linkedEquipmentId?: string
  ): void => {
    if (!fiveMEditModal) return;
    const { processId, label, issueId } = fiveMEditModal;

    setProcesses((prev) =>
      prev.map((process) => {
        if (process.id !== processId) return process;
        const currentIssues = process.fiveMIssues?.[label] ?? [];
        return {
          ...process,
          fiveMIssues: {
            ...process.fiveMIssues,
            [label]: currentIssues.map((item) => {
              if (item.id !== issueId) return item;
              return {
                ...item,
                details,
                linkedEquipmentId,
              };
            }),
          },
        };
      })
    );
    setFiveMEditModal(null);
  };

  /**
   * What it does:
   * Open the create modal for a family-level element.
   * Why it exists:
   * Family elements are created from the main header area.
   *
   * @returns Void; opens the modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   */
  const handleRequestAddFamilyElement = (): void => {
    setEditModal(null);
    setCreateModal({ mode: "family" });
  };

  /**
   * What it does:
   * Close the create modal without saving.
   * Why it exists:
   * Provides a consistent cancel path for creation flows.
   *
   * @returns Void; closes the modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   */
  const handleCloseCreateModal = (): void => {
    setCreateModal(null);
  };

  /**
   * What it does:
   * Open the edit modal for the single family-level element.
   * Why it exists:
   * Allows the header element to be edited from its edit icon.
   *
   * @returns Void; opens the edit modal when possible.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - No-op when no family element exists.
   */
  const handleRequestEditFamilyElement = (): void => {
    const element = familyElements[0];
    if (!element) return;
    setCreateModal(null);
    setEditModal({
      mode: "family",
      initialValues: {
        elementName: element.name,
        details: element.details,
      },
    });
  };

  /**
   * What it does:
   * Open the edit modal for a process-attached element.
   * Why it exists:
   * Supports editing the element shown inside the process card.
   *
   * @param processId - Process id owning the element.
   * @returns Void; opens the edit modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - No-op when the process or element is missing.
   */
  const handleRequestEditProcessElement = (processId: string): void => {
    const process = processes.find((item) => item.id === processId);
    const element = process?.element;
    if (!process || !element) return;
    setCreateModal(null);
    setEditModal({
      mode: "process-element",
      processId,
      initialValues: {
        elementName: element.name,
        details: element.details,
      },
    });
  };

  /**
   * What it does:
   * Open the edit modal for an equipment element.
   * Why it exists:
   * Enables per-equipment editing via the element edit icon.
   *
   * @param processId - Process id owning the equipment element.
   * @param elementId - Equipment element id to edit.
   * @returns Void; opens the edit modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - No-op when the process or equipment element is missing.
   */
  const handleRequestEditEquipment = (
    processId: string,
    elementId: string
  ): void => {
    const process = processes.find((item) => item.id === processId);
    const element = process?.equipment.find((item) => item.id === elementId);
    if (!process || !element) return;
    setCreateModal(null);
    setEditModal({
      mode: "equipment",
      processId,
      elementId,
      initialValues: {
        elementName: element.name,
        details: element.details,
      },
    });
  };

  /**
   * What it does:
   * Close the edit modal without saving.
   * Why it exists:
   * Provides a cancel path for editing flows.
   *
   * @returns Void; closes the edit modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   */
  const handleCloseEditModal = (): void => {
    setEditModal(null);
  };

  /**
   * What it does:
   * Create a process or equipment entry from modal payload.
   * Why it exists:
   * Centralizes creation logic for reuse across the feature.
   *
   * @param payload - Process/element input values from the modal.
   * @returns Void; updates process state and closes the modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - Ignores submission if overview or modal mode is missing.
   */
  const handleCreateSubmit = (payload: CreateItemPayload): void => {
    if (!overview || !createModal) return;

    const details = normalizeDetails(payload.details);

    if (createModal.mode === "process") {
      const newProcess: Process = {
        id: createId(),
        productionLineId: overview.productionLine.id,
        name: payload.processName ?? "New process",
        status: "not_started",
        // Default notes are used until a dedicated editor is introduced.
        notes: "Add notes or key actions for this process.",
        equipment: [],
        element: {
          id: createId(),
          name: payload.elementName,
          status: "not_started",
          details,
        },
      };

      setProcesses((prev) => [...prev, newProcess]);
      setSelectedProcessId(newProcess.id);
      setCreateModal(null);
      return;
    }

    if (createModal.mode === "family") {
      setFamilyElements((prev) => {
        // Only one family element is allowed; replace existing data if present.
        if (prev.length > 0) {
          return [
            {
              ...prev[0],
              name: payload.elementName,
              details,
            },
          ];
        }
        return [
          {
            id: createId(),
            name: payload.elementName,
            details,
          },
        ];
      });
      setCreateModal(null);
      return;
    }

    setProcesses((prev) =>
      prev.map((process) => {
        if (process.id !== createModal.processId) return process;
        return {
          ...process,
          equipment: [
            ...process.equipment,
            {
              id: createId(),
              name: payload.elementName,
              status: "not_started",
              details,
            },
          ],
        };
      })
    );
    setCreateModal(null);
  };

  /**
   * What it does:
   * Update an existing element from the edit modal payload.
   * Why it exists:
   * Keeps edit mutations centralized and consistent with create flows.
   *
   * @param payload - Element input values from the modal.
   * @returns Void; updates element state and closes the modal.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - No-op when the edit modal is missing or the target cannot be found.
   */
  const handleEditSubmit = (payload: CreateItemPayload): void => {
    if (!editModal) return;

    const details = normalizeDetails(payload.details);

    if (editModal.mode === "family") {
      setFamilyElements((prev) => {
        if (prev.length === 0) return prev;
        return [
          {
            ...prev[0],
            name: payload.elementName,
            details,
          },
        ];
      });
      setEditModal(null);
      return;
    }

    if (editModal.mode === "process-element") {
      setProcesses((prev) =>
        prev.map((process) => {
          if (process.id !== editModal.processId) return process;
          if (!process.element) return process;
          return {
            ...process,
            element: {
              ...process.element,
              name: payload.elementName,
              details,
            },
          };
        })
      );
      setEditModal(null);
      return;
    }

    setProcesses((prev) =>
      prev.map((process) => {
        if (process.id !== editModal.processId) return process;
        return {
          ...process,
          equipment: process.equipment.map((item) =>
            item.id === editModal.elementId
              ? {
                ...item,
                name: payload.elementName,
                details,
              }
              : item
          ),
        };
      })
    );
    setEditModal(null);
  };

  /**
   * What it does:
   * Toggle an acceptance criteria checkbox state.
   * Why it exists:
   * Tracks progress for guide steps in the overview.
   *
   * @param stepIndex - Index of the guide step.
   * @param criteriaIndex - Index of the criteria within the step.
   * @returns Void; updates state.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - Out-of-range indices are ignored.
   */
  const handleToggleCriteria = (
    stepIndex: number,
    criteriaIndex: number
  ): void => {
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
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{overview.family.name}</h1>
            {familyElements.length === 0 ? (
              <button
                type="button"
                className={styles.familyAddElement}
                onClick={handleRequestAddFamilyElement}
                aria-label="Add family element"
                data-testid="family-add-element"
              >
                Add element
              </button>
            ) : (
              <div className={styles.familyElementCard} data-testid="family-element">
                <button
                  type="button"
                  className={styles.familyElementEditButton}
                  aria-label="Edit family element"
                  title="Edit family element"
                  onClick={handleRequestEditFamilyElement}
                >
                  ✎
                </button>
                <span className={styles.familyElementName}>
                  {familyElements[0]?.name}
                </span>
              </div>
            )}
          </div>
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
          onAddProcess={handleRequestAddProcess}
          onAddEquipment={handleRequestAddEquipment}
          onEditProcessElement={handleRequestEditProcessElement}
          onEditEquipment={handleRequestEditEquipment}
          onAddFiveMIssue={handleAddFiveMIssue}
          onToggleFiveMStatus={handleToggleFiveMStatus}
          onEditFiveMIssue={handleEditFiveMIssue}
        />
      </div>

      <CreateItemModal
        open={Boolean(createModal)}
        title={
          createModal?.mode === "process"
            ? "Create process"
            : createModal?.mode === "family"
              ? "Create family element"
              : "Create element"
        }
        processNameLabel={
          createModal?.mode === "process" ? "Process name" : undefined
        }
        elementNameLabel={
          createModal?.mode === "process"
            ? "Process element"
            : createModal?.mode === "family"
              ? "Family element"
              : "Element name"
        }
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateSubmit}
      />

      <CreateItemModal
        open={Boolean(editModal)}
        title="Edit element"
        elementNameLabel={
          editModal?.mode === "family"
            ? "Family element"
            : editModal?.mode === "process-element"
              ? "Process element"
              : "Element name"
        }
        initialValues={editModal?.initialValues}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
      />

      {fiveMEditModal && (
        <FiveMDetailModal
          open={Boolean(fiveMEditModal)}
          itemLabel={fiveMEditModal.label}
          initialDetails={fiveMEditModal.currentDetails}
          initialLinkedEquipmentId={fiveMEditModal.currentLinkedId}
          availableEquipment={fiveMEditModal.availableEquipment ?? []}
          onClose={() => setFiveMEditModal(null)}
          onSubmit={handleFiveMSubmit}
        />
      )}
    </div>
  );
}
