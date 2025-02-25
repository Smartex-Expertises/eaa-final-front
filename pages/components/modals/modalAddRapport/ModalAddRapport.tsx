import React from "react";
import { IoClose } from "react-icons/io5";
import FormAddRapport from "../../forms/enseignant/formAddRapport/FormAddRapport";
import styles from "./modaladdrapport.module.css";

interface ModalAddRapportProps {
  onClose: () => void;
  suiviId: string;
}

const ModalAddRapport: React.FC<ModalAddRapportProps> = ({
  onClose,
  suiviId,
}) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.right}>
          <div></div>
          <button className={styles.btnClose} onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <h2>Rapport de la séance</h2>
        <FormAddRapport suiviId={suiviId} />
      </div>
    </div>
  );
};

export default ModalAddRapport;
