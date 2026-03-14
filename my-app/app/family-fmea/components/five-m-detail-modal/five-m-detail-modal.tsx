import { useEffect, useState } from "react";
import styles from "./five-m-detail-modal.module.css";

interface FiveMDetailModalProps {
    open: boolean;
    itemLabel: string;
    initialDetails: string;
    initialLinkedEquipmentIds: string[];
    availableEquipment: { id: string; name: string }[];
    onClose: () => void;
    onSubmit: (details: string, linkedEquipmentIds: string[]) => void;
}

export default function FiveMDetailModal({
    open,
    itemLabel,
    initialDetails,
    initialLinkedEquipmentIds,
    availableEquipment,
    onClose,
    onSubmit,
}: FiveMDetailModalProps) {
    const [details, setDetails] = useState(initialDetails);
    const [linkedEquipmentIds, setLinkedEquipmentIds] = useState<string[]>(
        initialLinkedEquipmentIds
    );

    useEffect(() => {
        if (open) {
            setDetails(initialDetails);
            setLinkedEquipmentIds(initialLinkedEquipmentIds);
        }
    }, [open, initialDetails, initialLinkedEquipmentIds]);

    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Edit 5M Issue: {itemLabel}</h2>
                    <button type="button" className={styles.close} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.body}>
                    <label className={styles.label}>
                        Details
                        <textarea
                            className={styles.textarea}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Describe the issue or details here..."
                            rows={5}
                        />
                    </label>

                    {availableEquipment.length > 0 ? (
                        <div className={styles.linkSection}>
                            <label className={styles.selectLabel}>
                                Link to Equipment:
                                <div className={styles.checkboxList}>
                                    {availableEquipment.map((eq) => (
                                        <label key={eq.id} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={linkedEquipmentIds.includes(eq.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setLinkedEquipmentIds((prev) => [...prev, eq.id]);
                                                    } else {
                                                        setLinkedEquipmentIds((prev) =>
                                                            prev.filter((id) => id !== eq.id)
                                                        );
                                                    }
                                                }}
                                            />
                                            {eq.name}
                                        </label>
                                    ))}
                                </div>
                            </label>
                        </div>
                    ) : (
                        <p className={styles.noEquipment}>
                            No equipment available to link.
                        </p>
                    )}
                </div>

                <div className={styles.footer}>
                    <button type="button" className={styles.cancel} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={styles.submit}
                        onClick={() =>
                            onSubmit(details, linkedEquipmentIds)
                        }
                    >
                        Save
                    </button>
                </div>
            </div>
        </div >
    );
}
