import React from "react";
import styles from "./loaderupload.module.css";

export default function LoaderUpload() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>
    </div>
  );
}
