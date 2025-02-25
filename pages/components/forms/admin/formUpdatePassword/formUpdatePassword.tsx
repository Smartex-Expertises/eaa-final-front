import React, { useState, FormEvent } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoAdd } from "react-icons/io5";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export default function FormUpdatePassword() {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };

  const validateForm = (): FormErrors => {
    const validationErrors: FormErrors = {};

    if (!passwordData.currentPassword) {
      validationErrors.currentPassword = "Le mot de passe actuel est requis.";
    }

    if (!passwordData.newPassword) {
      validationErrors.newPassword = "Le nouveau mot de passe est requis.";
    } else if (passwordData.newPassword.length < 8) {
      validationErrors.newPassword = "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (passwordData.confirmPassword !== passwordData.newPassword) {
      validationErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    return validationErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        toast.success("Mot de passe mis à jour avec succès !");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Erreur lors de la mise à jour du mot de passe");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données", error);
      toast.error("Une erreur inconnue est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" />

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Modification du mot de passe</h2>

        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Mot de passe actuel</label>
          <input
            type="password"
            id="currentPassword"
            value={passwordData.currentPassword}
            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
            className={errors.currentPassword ? styles.inputError : ""}
          />
          {errors.currentPassword && (
            <p className={styles.error}>{errors.currentPassword}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <input
            type="password"
            id="newPassword"
            value={passwordData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
            className={errors.newPassword ? styles.inputError : ""}
          />
          {errors.newPassword && (
            <p className={styles.error}>{errors.newPassword}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={errors.confirmPassword ? styles.inputError : ""}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>

        {isLoading ? <LoaderForm /> : <Validate icon={<IoAdd />} text="Modifier le mot de passe" />}
      </form>
    </>
  );
}
