import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./modaladdavis.module.css";

interface ThemeDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAvis: (idSuivi: number, avis: string) => void;
  suiviId: number | null;
}

const ThemeDisplay: React.FC<ThemeDisplayProps> = ({
  isOpen,
  onClose,
  onSubmitAvis,
  suiviId,
}) => {
  const [avis, setAvis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAvisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAvis(e.target.value);
  };

  const handleSubmitAvis = () => {
    if (suiviId && avis.trim()) {
      setLoading(true);
      onSubmitAvis(suiviId, avis);
      setAvis("");
      onClose();
    }
  };


  if (!isOpen) return null;
  

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.right}>
          <div></div>
          <button className={styles.btnClose} onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <h2>Emettre un avis</h2>
        <textarea
          value={avis}
          onChange={handleAvisChange}
          placeholder="Écrivez votre avis ici..."
          className={styles.textarea}
        />
        {loading ? (
          <p style={{ textAlign: "center" }}>Validation en cours...</p>
        ) : (
          <button
            onClick={handleSubmitAvis}
            className={styles.confirmButton}
            disabled={loading}
          >
            Envoyer
          </button>
        )}
      </div>
    </div>
  );
};

export default ThemeDisplay;
