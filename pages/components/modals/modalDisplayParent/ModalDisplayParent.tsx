import React from "react";
import { IoClose } from "react-icons/io5";
import styles from "../stylemodaldisplay.module.css";

interface Parent {
  nom_complet_parent: string;
  email_parent: string | null;
  telephone_parent: string | null;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  parent: Parent | null;
}

const ModalDisplayParent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  parent,
}) => {
  if (!isOpen || !parent) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          <span className={styles.text}>Fermer</span>
          <span className={styles.icon}>
            <IoClose />
          </span>
        </button>

        <h2>Détails du Parent</h2>
        <p>
          <strong>Nom Complet:</strong> {parent.nom_complet_parent}
        </p>
        <p>
          <strong>Email:</strong> {parent.email_parent || "Non renseigné"}
        </p>
        <p>
          <strong>Téléphone:</strong>{" "}
          {parent.telephone_parent || "Non renseigné"}
        </p>
      </div>
    </div>
  );
};

export default ModalDisplayParent;
