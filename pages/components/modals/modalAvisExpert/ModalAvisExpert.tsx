import React from "react";
import { IoClose } from "react-icons/io5";
import styles from "./modalavisexpert.module.css";

interface AvisExpert {
  id_avis: number;
  avis: string;
  created_at: string;
}

interface ModalAvisExpertProps {
  isOpen: boolean;
  onClose: () => void;
  avisExperts: AvisExpert[];
}

const ModalAvisExpert: React.FC<ModalAvisExpertProps> = ({
  isOpen,
  onClose,
  avisExperts,
}) => {
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
        <h2>Avis expert</h2>
        {avisExperts.length > 0 ? (
          <div>
            {avisExperts.map((avis) => (
              <div key={avis.id_avis}>
                <hr />
                <div key={avis.id_avis}>
                  <p>
                    <strong>Date:</strong>
                    {new Date(avis.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Avis:</strong> {avis.avis}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>
            Aucun avis disponible pour ce suivi.
          </p>
        )}
      </div>
    </div>
  );
};

export default ModalAvisExpert;
