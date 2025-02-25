import React, { useState, useEffect } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  passwordEtudiant: string;
  passwordEnseignant: string;
  passwordParent: string;
  passwordExpert: string;
}

interface FormErrors {
  passwordEtudiant?: string;
  passwordEnseignant?: string;
  passwordParent?: string;
  passwordExpert?: string;
}

export default function FormDefaultPassword() {
  const [formData, setFormData] = useState<FormData>({
    passwordEtudiant: "",
    passwordEnseignant: "",
    passwordParent: "",
    passwordExpert: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/auth/default-password", {
          method: "GET",
        });
        const data = await response.json();
        setFormData({
          passwordEtudiant:
            data.find((item: any) => item.type_utilisateur === "etudiant")
              ?.password || "",
          passwordEnseignant:
            data.find((item: any) => item.type_utilisateur === "enseignant")
              ?.password || "",
          passwordParent:
            data.find((item: any) => item.type_utilisateur === "parent")
              ?.password || "",
          passwordExpert:
            data.find((item: any) => item.type_utilisateur === "expert")
              ?.password || "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.passwordEtudiant) {
      newErrors.passwordEtudiant = "Le mot de passe étudiant est requis.";
    }

    if (!formData.passwordEnseignant) {
      newErrors.passwordEnseignant = "Le mot de passe enseignant est requis.";
    }

    if (!formData.passwordParent) {
      newErrors.passwordParent = "Le mot de passe parent est requis.";
    }

    if (!formData.passwordExpert) {
      newErrors.passwordExpert = "Le mot de passe expert est requis.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/default-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Mots de passe mis à jour avec succès !");
      } else {
        toast.error(
          "Erreur lors de la mise à jour des mots de passe. Contactez la DSI"
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
    <form onSubmit={handleSubmit} style={{ padding: "5rem" }}>
      <ToastContainer position="bottom-right" />
      <div className={styles.formGroup}>
        <label htmlFor="passwordEtudiant">Mot de passe étudiant</label>
        <input
          type="text"
          id="passwordEtudiant"
          name="passwordEtudiant"
          value={formData.passwordEtudiant}
          onChange={(e) =>
            handleInputChange("passwordEtudiant", e.target.value)
          }
          className={errors.passwordEtudiant ? styles.inputError : ""}
        />
        {errors.passwordEtudiant && (
          <p className={styles.error}>{errors.passwordEtudiant}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="passwordEnseignant">Mot de passe enseignant</label>
        <input
          type="text"
          id="passwordEnseignant"
          name="passwordEnseignant"
          value={formData.passwordEnseignant}
          onChange={(e) =>
            handleInputChange("passwordEnseignant", e.target.value)
          }
          className={errors.passwordEnseignant ? styles.inputError : ""}
        />
        {errors.passwordEnseignant && (
          <p className={styles.error}>{errors.passwordEnseignant}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="passwordParent">Mot de passe parent</label>
        <input
          type="text"
          id="passwordParent"
          name="passwordParent"
          value={formData.passwordParent}
          onChange={(e) => handleInputChange("passwordParent", e.target.value)}
          className={errors.passwordParent ? styles.inputError : ""}
        />
        {errors.passwordParent && (
          <p className={styles.error}>{errors.passwordParent}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="passwordExpert">Mot de passe expert</label>
        <input
          type="text"
          id="passwordExpert"
          name="passwordExpert"
          value={formData.passwordExpert}
          onChange={(e) => handleInputChange("passwordExpert", e.target.value)}
          className={errors.passwordExpert ? styles.inputError : ""}
        />
        {errors.passwordExpert && (
          <p className={styles.error}>{errors.passwordExpert}</p>
        )}
      </div>
      {isLoading ? (
        <LoaderForm />
      ) : (
        <Validate icon={<IoCloudUploadOutline />} text="Mise à jour" />
      )}
    </form>
  );
}
