import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import styles from "../../styles.module.css";
import { IoAdd } from "react-icons/io5";

export default function FormAdminAccounts() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    type_utilisateur: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.login) newErrors.login = "Login requis";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    else if (formData.password.length < 8)
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    if (!formData.type_utilisateur)
      newErrors.type_utilisateur = "Type utilisateur requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Compte administrateur créé avec succès !");
        setFormData({
          login: "",
          password: "",
          type_utilisateur: "",
        });
        setErrors({});
      } else {
        toast.error(
          responseData.message || "Erreur lors de la création du compte."
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" />
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
      >
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="login">Login</label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={(e) => handleInputChange("login", e.target.value)}
                className={errors.login ? styles.inputError : ""}
              />
              {errors.login && <p className={styles.error}>{errors.login}</p>}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? styles.inputError : ""}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="type_utilisateur">Type d'utilisateur</label>
              <select
                id="type_utilisateur"
                name="type_utilisateur"
                value={formData.type_utilisateur}
                onChange={(e) =>
                  handleInputChange("type_utilisateur", e.target.value)
                }
                className={errors.type_utilisateur ? styles.inputError : ""}
              >
                <option value="">-- Sélectionnez un type --</option>
                <option value="admin">Administrateur du système</option>
                <option value="ResponsableProgramme">Responsable de programme</option>
                <option value="CommiteScientifique">Membres du commité scientique</option>
              </select>
              {errors.type_utilisateur && (
                <p className={styles.error}>{errors.type_utilisateur}</p>
              )}
            </div>
          </div>
        </div>
        {isLoading ? (
          <LoaderForm />
        ) : (
          <Validate icon={<IoAdd />} text="Créer le compte" />
        )}
      </form>
    </>
  );
}
