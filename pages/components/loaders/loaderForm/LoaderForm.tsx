import React from "react";
import styles from "./loaderform.module.css";

export default function LoaderForm() {
  return (
    <div className={styles.container}>
      <div className={styles.dotSpinner}>
        <div className={styles.dotSpinnerDot}></div>
        <div className={styles.dotSpinnerDot}></div>
        <div className={styles.dotSpinnerDot}></div>
        <div className={styles.dotSpinnerDot}></div>
        <div className={styles.dotSpinnerDot}></div>
        <div className={styles.dotSpinnerDot}></div>
        <div className={styles.dotSpinnerDot}></div>
        <div className={styles.dotSpinnerDot}></div>
      </div>
    </div>
  );
}
