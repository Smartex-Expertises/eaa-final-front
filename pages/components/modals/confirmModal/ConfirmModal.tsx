import React from "react";
import styles from "./confirmmodal.module.css";
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{description}</p>
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
};

export default ConfirmModal;
