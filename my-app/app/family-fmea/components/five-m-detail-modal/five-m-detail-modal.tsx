import { useEffect, useState } from "react";
import styles from "./five-m-detail-modal.module.css";

interface FiveMDetailModalProps {
    open: boolean;
    itemLabel: string;
    initialDetails: string;
    initialLinkedEquipmentId?: string;
    availableEquipment: { id: string; name: string }[];
    onClose: () => void;
    onSubmit: (details: string, linkedEquipmentId?: string) => void;
}

export default function FiveMDetailModal({
    open,
    itemLabel,
    initialDetails,
    initialLinkedEquipmentId,
    availableEquipment,
    onClose,
    onSubmit,
}: FiveMDetailModalProps) {
    const [details, setDetails] = useState(initialDetails);
    const [linkedEquipmentId, setLinkedEquipmentId] = useState<string | undefined>(
        initialLinkedEquipmentId
    );

    useEffect(() => {
        if (open) {
            setDetails(initialDetails);
            setLinkedEquipmentId(initialLinkedEquipmentId);
        }
    }, [open, initialDetails, initialLinkedEquipmentId]);

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
                                <select
                                    className={styles.select}
                                    value={linkedEquipmentId || ""}
                                    onChange={(e) =>
                                        setLinkedEquipmentId(e.target.value || undefined)
                                    }
                                >
                                    <option value="">-- No Link --</option>
                                    {availableEquipment.map((eq) => (
                                        <option key={eq.id} value={eq.id}>
                                            {eq.name}
                                        </option>
                                    ))}
                                </select>
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
                            onSubmit(details, linkedEquipmentId)
                        }
                    >
                        Save
                    </button>
                </div>
            </div>
        </div >
    );
}
