import React from "react";
import styles from "./confirmvalidatemodal.module.css";

interface ConfirmValidateModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmValidateModal({
  onConfirm,
  onCancel,
  title = "Confirmer le rapport",
  message = "Après lecture, voulez-vous confirmer ce rapport ?",
}: ConfirmValidateModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Oui
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            Non
          </button>
        </div>
      </div>
    </div>
  );
}
