import React from "react";
import { IoClose } from "react-icons/io5";
import styles from "../stylemodaldisplay.module.css";

interface ThemeDisplayProps {
  isOpen: boolean;
  theme: string | null;
  onClose: () => void;
}

const ThemeDisplay: React.FC<ThemeDisplayProps> = ({
  isOpen,
  theme,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          <span className={styles.text}>Fermer</span>
          <span className={styles.icon}>
            <IoClose />
          </span>
        </button>
        <h2>Thème de l'étudiant</h2>
        <p style={{textAlign:"center"}}>{theme ?? "Pas de thème défini."}</p>
      </div>
    </div>
  );
};

export default ThemeDisplay;
