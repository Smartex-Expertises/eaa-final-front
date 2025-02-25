import React from "react";
import styles from "./add.module.css";

interface AddBtnProps {
  titre?: string;
  onClick?: () => void;
}

export default function AddBtn({ titre = "Ajouter un rapport", onClick }: AddBtnProps) {
  return (
    <div className={styles.container} onClick={onClick} style={{ cursor: "pointer" }}>
      <div className={styles.plusButton}>
        <svg className={styles.plusIcon} viewBox="0 0 30 30">
          <g mask="url(#mask0_21_345)">
            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
          </g>
        </svg>
      </div>
      <h3>{titre}</h3>
    </div>
  );
}
