import React from "react";
import { IoClose } from "react-icons/io5";
import styles from "./allavismodal.module.css";

interface Expert {
  id_expert: number;
  nom: string;
  prenom: string;
}

interface Avis {
  id_avis: number;
  id_suivi: number;
  id_expert: number;
  avis: string;
  created_at: string;
  updated_at: string;
  expert: Expert;
}

interface AllAvisModalProps {
  avis: Avis[];
  onClose: () => void;
}

const AllAvisModal: React.FC<AllAvisModalProps> = ({ avis, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
      <div className={styles.right}>
          <div></div>
          <button className={styles.btnClose} onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <h2 className={styles.title}>Tous les Avis des Experts</h2>
        {avis.length > 0 ? (
          <div className={styles.avisList}>
            {avis.map((avisItem) => (
              <div key={avisItem.id_avis} className={styles.alert}>
                <div className={styles.alertHeader}>
                  <strong>
                    {avisItem.expert.nom} {avisItem.expert.prenom}
                  </strong>
                </div>
                <div className={styles.alertContent}>
                  <p className={styles.timestamp}>
                    Date d'émission :
                    {new Date(avisItem.created_at).toLocaleString()}
                  </p>
                  <p>Avis : {avisItem.avis}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun avis trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default AllAvisModal;
