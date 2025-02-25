import React from "react";
import { IoClose } from "react-icons/io5";
import styles from "../stylemodaldisplay.module.css";

interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom_etudiant: string;
  prenom_etudiant: string;
  niveau: string;
  classe: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  etudiants: Etudiant[];
}

const ModalDisplayStudent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  etudiants,
}) => {
  if (!isOpen || etudiants.length === 0) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          <span className={styles.text}>Fermer</span>
          <span className={styles.icon}>
            <IoClose />
          </span>
        </button>

        <h2>Etudiants</h2>
        {etudiants.map((etudiant) => (
          <div key={etudiant.id_etudiant}>
            <p>
              <strong>Etudiant:</strong> {etudiant.nom_etudiant}{" "}
              {etudiant.prenom_etudiant} - ({etudiant.classe})
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalDisplayStudent;
