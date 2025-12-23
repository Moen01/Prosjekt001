'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import clsx from "clsx";
import type { StatusColor } from "@lib/types/fmea";
import styles from "./processDefinerProcessBox.module.css";

const STATUS_OPTIONS: Array<{ color: StatusColor; label: string }> = [
  { color: "red", label: "Not started" },
  { color: "yellow", label: "In progress" },
  { color: "green", label: "Completed" },
];

export default function ProcessDefinerProcessBox() {
  const [name, setName] = useState("Process 1");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<StatusColor>("red");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const statusConfig = useMemo(
    () => STATUS_OPTIONS.find((option) => option.color === status)!,
    [status]
  );

  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowMenu(true);
    if (menuRef.current) {
      menuRef.current.style.left = `${event.clientX}px`;
      menuRef.current.style.top = `${event.clientY}px`;
    }
  };

  useEffect(() => {
    if (!showMenu) {
      return;
    }

    const hide = () => setShowMenu(false);
    window.addEventListener("click", hide);
    return () => window.removeEventListener("click", hide);
  }, [showMenu]);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.statusButton}
        style={{ background: statusConfig.color }}
        onClick={() => setEditing(true)}
        onContextMenu={handleContextMenu}
        title="Left-click to rename. Right-click to change status."
      >
        {editing ? (
          <input
            className={styles.nameInput}
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setEditing(false);
              }
            }}
          />
        ) : (
          name
        )}
      </button>

      {showMenu ? (
        <div ref={menuRef} className={styles.statusMenu}>
          {STATUS_OPTIONS.map((option) => (
            <div
              key={option.color}
              className={clsx(styles.statusOption, {
                [styles.statusOptionActive]: option.color === status,
              })}
              onClick={() => {
                setStatus(option.color);
                setShowMenu(false);
              }}
            >
              <span
                className={styles.statusSwatch}
                style={{ background: option.color }}
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
