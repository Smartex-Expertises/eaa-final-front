import styles from "../styles.module.css";
import React, { useState } from "react";
import { useRouter } from "next/router";
import LoaderForm from "../../loaders/loaderForm/LoaderForm";
import Validate from "../../buttons/validate/Validate";
import styleschangepassword from "./changepassword.module.css";
import { IoRepeat } from "react-icons/io5";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorPassword) setErrorPassword("");
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (errorConfirmPassword) setErrorConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!password) {
      setErrorPassword("Le mot de passe est obligatoire.");
      hasError = true;
    } else if (password.length < 8) {
      setErrorPassword("Le mot de passe doit contenir au moins 8 caractères.");
      hasError = true;
    }

    if (!confirmPassword) {
      setErrorConfirmPassword(
        "La confirmation du mot de passe est obligatoire."
      );
      hasError = true;
    } else if (password !== confirmPassword) {
      setErrorConfirmPassword("Les mots de passe ne correspondent pas.");
      hasError = true;
    }

    if (hasError) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          router.push("/");
        }
      } else {
        alert(`Erreur : ${data.error}`);
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de la vérification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styleschangepassword.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Nouveau mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className={errorPassword ? styles.inputError : ""}
            />
            {errorPassword && <p className={styles.error}>{errorPassword}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={errorConfirmPassword ? styles.inputError : ""}
            />
            {errorConfirmPassword && (
              <p className={styles.error}>{errorConfirmPassword}</p>
            )}
          </div>
          <div className={styles.centerContainer}>
            {isLoading ? (
              <LoaderForm />
            ) : (
              <Validate
                icon={<IoRepeat />}
                text="Changer le mot de passe par défaut"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
