import React from "react";
import styles from "../stylemodaldisplay.module.css";
import { IoClose } from "react-icons/io5";

interface Enseignant {
  id_enseignant: number;
  matricule: string;
  nom: string;
  prenom: string;
  type: string;
  specialite: string;
  grade: string;
  telephone: string;
  email: string;
  photo: string | null;
  en_ligne: number;
  id_compte: number;
  created_at: string;
  updated_at: string;
}

interface ModalEncadrantsProps {
  enseignant1: Enseignant | null;
  enseignant2: Enseignant | null;
  onClose: () => void;
}

const ModalEncadrants: React.FC<ModalEncadrantsProps> = ({
  enseignant1,
  enseignant2,
  onClose,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          <span className={styles.text}>Fermer</span>
          <span className={styles.icon}>
            <IoClose />
          </span>
        </button>
        <h2>Directeurs de mémoire</h2>
        <hr />
        {enseignant1 && (
          <div>
            <h3>Directeurs de mémoire 1:</h3>
            <p>
              <strong>Nom:</strong> {enseignant1.nom} {enseignant1.prenom}
            </p>
            <p>
              <strong>Grade:</strong> {enseignant1.grade}
            </p>
            <p>
              <strong>Email:</strong> {enseignant1.email}
            </p>
            <p>
              <strong>Téléphone:</strong> {enseignant1.telephone}
            </p>
          </div>
        )}
        <hr />
        {enseignant2 && (
          <div>
            <h3>Directeurs de mémoire 2:</h3>
            <p>
              <strong>Nom:</strong> {enseignant2.nom} {enseignant2.prenom}
            </p>
            <p>
              <strong>Grade:</strong> {enseignant2.grade}
            </p>
            <p>
              <strong>Email:</strong> {enseignant2.email}
            </p>
            <p>
              <strong>Téléphone:</strong> {enseignant2.telephone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalEncadrants;
