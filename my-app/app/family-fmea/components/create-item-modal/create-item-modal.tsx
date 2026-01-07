"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementDetails } from "@lib/types/familyFmea";
import styles from "./create-item-modal.module.css";

/**
 * Modal payload for creating a process element or equipment element.
 */
export interface CreateItemPayload {
  /** Optional process name when creating a new process. */
  processName?: string;
  /** Element name to be attached to a process or equipment list. */
  elementName: string;
  /** Optional detail fields captured during creation. */
  details: ElementDetails;
}

/**
 * Optional initial values used to prefill the modal for editing flows.
 */
export interface CreateItemInitialValues {
  /** Optional process name to prefill when editing a process. */
  processName?: string;
  /** Optional element name to prefill when editing an element. */
  elementName?: string;
  /** Optional detail fields to prefill for edits. */
  details?: ElementDetails;
}

/**
 * Props for the reusable create-item modal.
 */
interface CreateItemModalProps {
  /** Controls modal visibility. */
  open: boolean;
  /** Title displayed in the modal header. */
  title: string;
  /** Optional label for the process name input. */
  processNameLabel?: string;
  /** Label for the element name input. */
  elementNameLabel: string;
  /** Optional initial values for edit flows. */
  initialValues?: CreateItemInitialValues;
  /** Called when the user cancels the modal. */
  onClose: () => void;
  /** Called with the creation payload when the user saves. */
  onSubmit: (payload: CreateItemPayload) => void;
}

/**
 * Responsibility:
 * Provide a reusable modal for creating processes or elements with optional details.
 * Props:
 * - open: controls visibility.
 * - title: modal heading.
 * - processNameLabel: optional process name field label.
 * - elementNameLabel: element name field label.
 * - onClose: cancel handler.
 * - onSubmit: save handler with payload.
 * State:
 * - processName: controlled input for process name.
 * - elementName: controlled input for element name.
 * - details: controlled inputs for optional detail fields.
 * Side effects:
 * - useEffect: resets form state on open.
 * Rendering states:
 * - loading: n/a.
 * - error: n/a.
 * - empty: modal hidden when open is false.
 * - success: renders form inputs and actions.
 */
export default function CreateItemModal({
  open,
  title,
  processNameLabel,
  elementNameLabel,
  initialValues,
  onClose,
  onSubmit,
}: CreateItemModalProps) {
  const [processName, setProcessName] = useState("");
  const [elementName, setElementName] = useState("");
  const [details, setDetails] = useState<ElementDetails>({});

  useEffect(() => {
    if (!open) return;
    // Reset form state every time the modal opens, using initial values if provided.
    setProcessName(initialValues?.processName ?? "");
    setElementName(initialValues?.elementName ?? "");
    setDetails(initialValues?.details ?? {});
  }, [open, initialValues]);

  // Reveal optional fields only after the element name has a value.
  const showDetails = elementName.trim().length > 0;
  const requiresProcessName = Boolean(processNameLabel);

  // Disable save until all required name fields are filled.
  const isSaveDisabled = useMemo(() => {
    if (requiresProcessName && processName.trim().length === 0) return true;
    return elementName.trim().length === 0;
  }, [elementName, processName, requiresProcessName]);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.fieldList}>
          {processNameLabel ? (
            <label className={styles.field}>
              <span className={styles.label}>{processNameLabel}</span>
              <input
                className={styles.input}
                value={processName}
                onChange={(event) => setProcessName(event.target.value)}
                placeholder="Enter process name"
              />
            </label>
          ) : null}

          <label className={styles.field}>
            <span className={styles.label}>{elementNameLabel}</span>
            <input
              className={styles.input}
              value={elementName}
              onChange={(event) => setElementName(event.target.value)}
              placeholder="Enter element name"
            />
          </label>

          {showDetails ? (
            <>
              <label className={styles.field}>
                <span className={styles.label}>Feasability</span>
                <input
                  className={styles.input}
                  value={details.feasability ?? ""}
                  onChange={(event) =>
                    setDetails((prev) => ({
                      ...prev,
                      feasability: event.target.value,
                    }))
                  }
                  placeholder="Enter feasability notes"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>FMEA</span>
                <input
                  className={styles.input}
                  value={details.fmea ?? ""}
                  onChange={(event) =>
                    setDetails((prev) => ({ ...prev, fmea: event.target.value }))
                  }
                  placeholder="Enter FMEA notes"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Inspection</span>
                <input
                  className={styles.input}
                  value={details.inspection ?? ""}
                  onChange={(event) =>
                    setDetails((prev) => ({
                      ...prev,
                      inspection: event.target.value,
                    }))
                  }
                  placeholder="Enter inspection notes"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>SC</span>
                <input
                  className={styles.input}
                  value={details.sc ?? ""}
                  onChange={(event) =>
                    setDetails((prev) => ({ ...prev, sc: event.target.value }))
                  }
                  placeholder="Enter SC notes"
                />
              </label>
            </>
          ) : null}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() =>
              onSubmit({
                processName: processName.trim() || undefined,
                elementName: elementName.trim(),
                details,
              })
            }
            disabled={isSaveDisabled}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
