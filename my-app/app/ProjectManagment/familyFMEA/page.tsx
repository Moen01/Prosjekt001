'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import ButtonBack from "@/app/components/buttonBack/page";
import { createId } from "@lib/utils/id";
import styles from "./familyFMEA.module.css";

/**
 * Family FMEA list entry for the overview panel.
 */
interface FamilyFmeaEntry {
  /** Unique identifier for the entry. */
  id: string;
  /** Display title for the family entry. */
  title: string;
  /** Route to the Family FMEA board for this entry. */
  link: string;
}

const defaultEntries: FamilyFmeaEntry[] = ["M52", "M76", "M78"].map(
  (title) => ({
    id: createId(),
    title,
    // Route into the active Family FMEA board (newFamily is deprecated).
    link: `/family-fmea?title=${encodeURIComponent(title)}`,
  })
);

/**
 * Responsibility:
 * Render the Family FMEA selection list and navigation actions.
 * Props:
 * - none.
 * State:
 * - entries/selectedEntry: list of family entries and selection.
 * - newTitle/isAdding: input state for new entries.
 * - error: validation and selection errors.
 * Side effects:
 * - Router navigation for opening a Family FMEA.
 * Rendering states:
 * - loading: n/a.
 * - error: shows error text.
 * - empty: list still renders with no entries.
 * - success: renders list and actions.
 */
export default function FamilyFmeaHandler() {
  const router = useRouter();
  const [entries, setEntries] = useState<FamilyFmeaEntry[]>(defaultEntries);
  const [selectedEntry, setSelectedEntry] = useState<FamilyFmeaEntry | null>(
    null
  );
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.title.localeCompare(b.title)),
    [entries]
  );

  /**
   * What it does:
   * Add a new Family FMEA entry to the list.
   * Why it exists:
   * Supports creating new family boards from the list view.
   *
   * @returns Void; updates entries and input state.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - Rejects empty titles and sets an error message.
   */
  const handleAdd = (): void => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setError("Family FMEA name cannot be empty");
      return;
    }

    const newEntry: FamilyFmeaEntry = {
      id: createId(),
      title: trimmed,
      // Route into the active Family FMEA board (newFamily is deprecated).
      link: `/family-fmea?title=${encodeURIComponent(trimmed)}`,
    };

    setEntries((prev) => [...prev, newEntry]);
    setNewTitle("");
    setIsAdding(false);
    setError(null);
  };

  /**
   * What it does:
   * Navigate to the selected Family FMEA board.
   * Why it exists:
   * Opens the chosen board from the list.
   *
   * @returns Void; triggers router navigation.
   *
   * @throws None.
   * @sideEffects Uses Next.js router navigation.
   *
   * Edge cases:
   * - Shows an error when no entry is selected.
   */
  const handleOpen = (): void => {
    if (selectedEntry) {
      router.push(selectedEntry.link);
    } else {
      setError("Select a Family FMEA to open");
    }
  };

  /**
   * What it does:
   * Remove the selected entry from the list.
   * Why it exists:
   * Allows users to remove obsolete Family FMEA entries.
   *
   * @returns Void; updates entries and selection state.
   *
   * @throws None.
   * @sideEffects Updates component state.
   *
   * Edge cases:
   * - Shows an error when no entry is selected.
   */
  const handleRemove = (): void => {
    if (!selectedEntry) {
      setError("Select a Family FMEA to remove");
      return;
    }

    setEntries((prev) => prev.filter((entry) => entry.id !== selectedEntry.id));
    setSelectedEntry(null);
    setError(null);
  };

  return (
    <div className={styles.familyFmeaContainer}>
      <div className={styles.blogBox}>
        <div className={styles.nameplateRow}>
          <ButtonBack href="/ProjectManagment" />
          <div className={styles.nameplate}>Family FMEA</div>
        </div>
        <div className={styles.blogList}>
          {sortedEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={clsx(styles.blogItem, {
                [styles.blogItemSelected]: selectedEntry?.id === entry.id,
              })}
              onClick={() => {
                setSelectedEntry(entry);
                setError(null);
              }}
            >
              {entry.title}
            </button>
          ))}
          {isAdding ? (
            <div className={styles.newBlogItem}>
              <input
                type="text"
                className={styles.newBlogInput}
                placeholder="Enter new Family FMEA"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
              />
              <button className={styles.actionButton} onClick={handleAdd}>
                Add
              </button>
            </div>
          ) : null}
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.actionButtons}>
            <button
              className={styles.actionButton}
              onClick={() => {
                setIsAdding(true);
                setError(null);
              }}
            >
              New Family FMEA
            </button>
            <button className={styles.actionButton} onClick={handleOpen}>
              Open Family FMEA
            </button>
            <button className={styles.actionButton} disabled>
              Open maintenance list
            </button>
          </div>
          <button className={styles.removeButton} onClick={handleRemove}>
            ×
          </button>
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
      </div>
    </div>
  );
}
