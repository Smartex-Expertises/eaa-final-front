import React from "react";
import styles from "./stylesonglet.module.css";

interface BtnOngletProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Onglet: React.FC<BtnOngletProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.onglet} ${isActive ? styles.active : ""}`}
    >
      {label}
    </button>
  );
};

export default Onglet;
