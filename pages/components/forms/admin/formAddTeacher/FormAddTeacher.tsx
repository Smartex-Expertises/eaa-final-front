import React, { useState, FormEvent } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoAdd } from "react-icons/io5";

interface FormData {
  matricule: string;
  nom: string;
  prenom: string;
  type: string;
  specialite: string;
  grade: string;
  telephone: string;
  email: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export default function FormAddTeacher() {
  const [formData, setFormData] = useState<FormData>({
    matricule: "",
    nom: "",
    prenom: "",
    type: "",
    specialite: "",
    grade: "",
    telephone: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors: FormErrors = {};

    // Vérification des champs
    if (!formData.matricule)
      validationErrors.matricule = "Le matricule est requis.";
    if (!formData.nom) validationErrors.nom = "Le nom est requis.";
    if (!formData.prenom) validationErrors.prenom = "Le prénom est requis.";
    if (!formData.type) validationErrors.type = "Le type est requis.";
    if (!formData.grade) validationErrors.grade = "Le grade est requis.";
    if (!formData.specialite)
      validationErrors.specialite = "La spécialité est requise.";

    if (!formData.telephone)
      validationErrors.telephone = "Le téléphone est requis.";
    else if (!/^\d+$/.test(formData.telephone))
      validationErrors.telephone =
        "Le téléphone doit contenir uniquement des chiffres.";
    else if (formData.telephone.length !== 10)
      validationErrors.telephone = "Le téléphone doit contenir 10 chiffres.";

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "L'email est invalide.";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      // Simuler une requête vers l'API pour ajouter un enseignant
      const response = await fetch("/api/teacher/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Enseignant ajouté avec succès!");
        setFormData({
          matricule: "",
          nom: "",
          prenom: "",
          type: "",
          specialite: "",
          grade: "",
          telephone: "",
          email: "",
        });
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        toast.error(
          errorData.error || "Erreur lors de l'ajout de l'enseignant"
        );
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
        <h2>Informations de l'enseignant</h2>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="matricule">Matricule</label>
              <input
                type="text"
                id="matricule"
                name="matricule"
                value={formData.matricule}
                onChange={(e) => handleInputChange("matricule", e.target.value)}
                className={errors.matricule ? styles.inputError : ""}
              />
              {errors.matricule && (
                <p className={styles.error}>{errors.matricule}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                className={errors.nom ? styles.inputError : ""}
              />
              {errors.nom && <p className={styles.error}>{errors.nom}</p>}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="prenom">Prénoms</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={(e) => handleInputChange("prenom", e.target.value)}
                className={errors.prenom ? styles.inputError : ""}
              />
              {errors.prenom && <p className={styles.error}>{errors.prenom}</p>}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="text"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={(e) => handleInputChange("telephone", e.target.value)}
                className={errors.telephone ? styles.inputError : ""}
              />
              {errors.telephone && (
                <p className={styles.error}>{errors.telephone}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? styles.inputError : ""}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className={errors.type ? styles.inputError : ""}
              >
                <option value="">Sélectionner un type</option>
                <option value="Architecte">Architecte</option>
                <option value="Non architecte">Non architecte</option>
              </select>
              {errors.type && <p className={styles.error}>{errors.type}</p>}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="specialite">Spécialité</label>
              <input
                type="text"
                id="specialite"
                name="specialite"
                value={formData.specialite}
                onChange={(e) =>
                  handleInputChange("specialite", e.target.value)
                }
                className={errors.specialite ? styles.inputError : ""}
              />
              {errors.specialite && (
                <p className={styles.error}>{errors.specialite}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="grade">Grade</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={(e) => handleInputChange("grade", e.target.value)}
                className={errors.grade ? styles.inputError : ""}
              >
                <option value="">Sélectionner un grade</option>
                <option value="Assistant">Assistant</option>
                <option value="Maître de Conférences">
                  Maître de Conférences
                </option>
                <option value="Professeur">Professeur</option>
              </select>
              {errors.grade && <p className={styles.error}>{errors.grade}</p>}
            </div>
          </div>
        </div>
        {isLoading ? (
          <LoaderForm />
        ) : (
          <Validate icon={<IoAdd />} text="Ajouter" />
        )}
      </form>
    </>
  );
}
