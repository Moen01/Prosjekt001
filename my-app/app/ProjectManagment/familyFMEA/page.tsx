'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import ButtonBack from "@/app/components/buttonBack/page";
import { createId } from "@lib/utils/id";
import styles from "./familyFMEA.module.css";

interface FamilyFmeaEntry {
  id: string;
  title: string;
  link: string;
}

const defaultEntries: FamilyFmeaEntry[] = ["M52", "M76", "M78"].map(
  (title) => ({
    id: createId(),
    title,
    link: `/newFamily?title=${encodeURIComponent(title)}`,
  })
);

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

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setError("Family FMEA name cannot be empty");
      return;
    }

    const newEntry: FamilyFmeaEntry = {
      id: createId(),
      title: trimmed,
      link: `/newFamily?title=${encodeURIComponent(trimmed)}`,
    };

    setEntries((prev) => [...prev, newEntry]);
    setNewTitle("");
    setIsAdding(false);
    setError(null);
  };

  const handleOpen = () => {
    if (selectedEntry) {
      router.push(selectedEntry.link);
    } else {
      setError("Select a Family FMEA to open");
    }
  };

  const handleRemove = () => {
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
