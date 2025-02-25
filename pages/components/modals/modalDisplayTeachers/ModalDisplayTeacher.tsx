import React from "react";
import { IoClose } from "react-icons/io5";
import styles from "../stylemodaldisplay.module.css";

interface Encadrant {
  id_enseignant: number;
  nom_enseignant: string;
  prenom_enseignant: string;
  type: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  encadrants: Encadrant[];
}

const ModalDisplayTeacher: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  encadrants,
}) => {
  if (!isOpen || encadrants.length === 0) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          <span className={styles.text}>Fermer</span>
          <span className={styles.icon}>
            <IoClose />
          </span>
        </button>
        <h2>Liste des directeurs de mémoires</h2>
        {encadrants.map((encadrant) => (
          <div key={encadrant.id_enseignant}>
            <p>
              <strong>Directeur de mémoire:</strong> {encadrant.nom_enseignant}{" "}
              {encadrant.prenom_enseignant} - ({encadrant.type})
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalDisplayTeacher;
