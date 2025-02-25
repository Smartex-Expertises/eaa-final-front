import React, { useState, useEffect, FormEvent } from "react";
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
  telephone: string;
  email: string;
  niveau: string;
  classe: string;
  nom_complet_parent: string;
  email_parent: string;
  telephone_parent: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
}

export default function FormAddStudent() {
  const [formData, setFormData] = useState<FormData>({
    matricule: "",
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    niveau: "",
    classe: "",
    nom_complet_parent: "",
    email_parent: "",
    telephone_parent: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [classesByNiveau, setClassesByNiveau] = useState<{
    [key: string]: Classe[];
  }>({
    Licence: [],
    Master: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/class/class", {
          method: "GET",
        });
        const data = await response.json();
        const classesByLevel = {
          Licence: data.data.filter(
            (classe: any) => classe.niveau === "Licence"
          ),
          Master: data.data.filter((classe: any) => classe.niveau === "Master"),
        };
        setClassesByNiveau(classesByLevel);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors: FormErrors = {};
    if (!formData.matricule)
      validationErrors.matricule = "Le matricule est requis.";
    if (!formData.nom) validationErrors.nom = "Le nom est requis.";
    if (!formData.prenom) validationErrors.prenom = "Le prénom est requis.";
    if (!formData.telephone)
      validationErrors.telephone = "Le téléphone est requis.";
    else if (!/^\d+$/.test(formData.telephone))
      validationErrors.telephone =
        "Le téléphone doit contenir uniquement des chiffres.";
    else if (formData.telephone.length !== 10) {
      validationErrors.telephone = "Le téléphone doit contenir 10 chiffres.";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "L'email est invalide.";

    if (!formData.niveau) validationErrors.niveau = "Le niveau est requis.";
    if (!formData.classe) validationErrors.classe = "La classe est requise.";
    if (!formData.nom_complet_parent)
      validationErrors.nom_complet_parent =
        "Le nom complet du parent est requis.";

    if (!formData.email_parent || !/\S+@\S+\.\S+/.test(formData.email_parent))
      validationErrors.email_parent = "L'email du parent est invalide.";

    if (!formData.telephone_parent)
      validationErrors.telephone_parent = "Le téléphone du parent est requis.";
    else if (!/^\d+$/.test(formData.telephone_parent))
      validationErrors.telephone_parent =
        "Le téléphone du parent doit contenir uniquement des chiffres.";
    else if (formData.telephone_parent.length !== 10) {
      validationErrors.telephone_parent =
        "Le téléphone du parent doit contenir 10 chiffres.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/student/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Étudiant et parent ajoutés avec succès!");
        setFormData({
          matricule: "",
          nom: "",
          prenom: "",
          telephone: "",
          email: "",
          niveau: "",
          classe: "",
          nom_complet_parent: "",
          email_parent: "",
          telephone_parent: "",
        });
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        toast.error(errorData.error || "Erreur lors de l'ajout de l'étudiant");
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
        <h2>Informations de l&apos;étudiant</h2>
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
              <label htmlFor="niveau">Niveau</label>
              <select
                id="niveau"
                name="niveau"
                value={formData.niveau}
                onChange={(e) => handleInputChange("niveau", e.target.value)}
                className={errors.niveau ? styles.inputError : ""}
              >
                <option value="">Sélectionner un niveau</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
              </select>
              {errors.niveau && <p className={styles.error}>{errors.niveau}</p>}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="classe">Classe</label>
              <select
                id="classe"
                name="classe"
                value={formData.classe}
                onChange={(e) => handleInputChange("classe", e.target.value)}
                className={errors.classe ? styles.inputError : ""}
              >
                <option value="">Sélectionner une classe</option>
                {classesByNiveau[formData.niveau]?.map((classe) => (
                  <option key={classe.id} value={classe.nom}>
                    {classe.nom}
                  </option>
                ))}
              </select>
              {errors.classe && <p className={styles.error}>{errors.classe}</p>}
            </div>
          </div>
        </div>
        <h2>Informations du parent</h2>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="nom_complet_parent">Nom complet</label>
              <input
                type="text"
                id="nom_complet_parent"
                name="nom_complet_parent"
                value={formData.nom_complet_parent}
                onChange={(e) =>
                  handleInputChange("nom_complet_parent", e.target.value)
                }
                className={errors.nom_complet_parent ? styles.inputError : ""}
              />
              {errors.nom_complet_parent && (
                <p className={styles.error}>{errors.nom_complet_parent}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="email_parent">Email</label>
              <input
                type="email"
                id="email_parent"
                name="email_parent"
                value={formData.email_parent}
                onChange={(e) =>
                  handleInputChange("email_parent", e.target.value)
                }
                className={errors.email_parent ? styles.inputError : ""}
              />
              {errors.email_parent && (
                <p className={styles.error}>{errors.email_parent}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="telephone_parent">Téléphone</label>
              <input
                type="text"
                id="telephone_parent"
                name="telephone_parent"
                value={formData.telephone_parent}
                onChange={(e) =>
                  handleInputChange("telephone_parent", e.target.value)
                }
                className={errors.telephone_parent ? styles.inputError : ""}
              />
              {errors.telephone_parent && (
                <p className={styles.error}>{errors.telephone_parent}</p>
              )}
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
