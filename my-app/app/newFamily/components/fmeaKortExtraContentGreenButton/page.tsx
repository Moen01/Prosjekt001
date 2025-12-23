'use client';

import { useState } from "react";
import styles from "./fmeaKortExtraContentGreenButton.module.css";

interface FmeaKortExtraContentGreenButtonProps {
  onClose: () => void;
}

export default function FmeaKortExtraContentGreenButton({
  onClose,
}: FmeaKortExtraContentGreenButtonProps) {
  const [timerValue, setTimerValue] = useState(1);
  const [timerUnit, setTimerUnit] = useState("minutes");
  const [weekday, setWeekday] = useState("Monday");

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className={styles.overText}>Preventive action</h2>
        <div className={styles.contentColumns}>
          <div className={styles.columnCard}>
            <h3>Schedule</h3>
            <select
              value={weekday}
              onChange={(event) => setWeekday(event.target.value)}
              className={styles.selectField}
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className={styles.columnCard}>
            <h3>Cadence</h3>
            <div className={styles.timerRow}>
              <span>Once every</span>
              <input
                type="number"
                min={1}
                className={styles.inputField}
                value={timerValue}
                onChange={(event) => setTimerValue(Number(event.target.value))}
              />
              <select
                value={timerUnit}
                onChange={(event) => setTimerUnit(event.target.value)}
                className={styles.selectField}
              >
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="days">days</option>
                <option value="months">months</option>
                <option value="years">years</option>
              </select>
            </div>
            <button className={styles.primaryButton}>Add preventive action +</button>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.primaryButton} onClick={onClose}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
