import React from "react";
import styles from "./stylesvalidate.module.css";

interface ButtonProps {
  icon: React.ReactNode;
  text: string;
}

export default function Validate({ icon, text }: ButtonProps) {
  return (
    <button type="submit" className={styles.submitButton}>
      {icon}
      <span>{text}</span>
    </button>
  );
}
