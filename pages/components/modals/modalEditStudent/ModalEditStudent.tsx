import React, { useState, useEffect, FormEvent } from "react";
import { IoClose, IoSave } from "react-icons/io5";
import styles from "../stylemodaldisplay.module.css";
import formStyles from "../../forms/styles.module.css";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import Validate from "@/pages/components/buttons/validate/Validate";
import { toast,ToastContainer } from "react-toastify";


interface Student {
  id_etudiant: number;
  matricule: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  niveau: string;
  classe: string;
  parent: Parent;
}

interface Parent {
  id_parent: number;
  nom_complet_parent: string;
  email_parent: string ;
  telephone_parent: string ;
}  

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  etudiant: Student | null;
  
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ModalEditStudent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  etudiant,
  
}) => {
  const [formData, setFormData] = useState<Student | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [classesByNiveau, setClassesByNiveau] = useState<{
    [key: string]: Classe[];
  }>({
    Licence: [],
    Master: [],
  });

  useEffect(() => {
    if (etudiant) {
      setFormData(etudiant);
    }
  }, [etudiant]);

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

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen || !formData) return null;

  // Handle input changes for student properties
  const handleInputChange = (field: keyof Student, value: string) => {
    setFormData((prevData) => 
      prevData ? { ...prevData, [field]: value } : null
    );
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };

  // Handle input changes for parent properties
  const handleParentInputChange = (field: keyof Parent, value: string) => {
    setFormData((prevData) => 
      prevData ? { 
        ...prevData, 
        parent: { ...prevData.parent, [field]: value } 
      } : null
    );
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors: FormErrors = {};
    if (!formData.matricule)
      validationErrors.matricule = "Le matricule est requis.";
    if (!formData.nom) 
      validationErrors.nom = "Le nom est requis.";
    if (!formData.prenom) 
      validationErrors.prenom = "Le prénom est requis.";
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
    if (!formData.parent.nom_complet_parent)
      validationErrors.nom_complet_parent =
        "Le nom complet du parent est requis.";

    if (!formData.parent.email_parent || !/\S+@\S+\.\S+/.test(formData.parent.email_parent))
      validationErrors.email_parent = "L'email du parent est invalide.";

    if (!formData.parent.telephone_parent)
      validationErrors.telephone_parent = "Le téléphone du parent est requis.";
    else if (!/^\d+$/.test(formData.parent.telephone_parent))
      validationErrors.telephone_parent =
        "Le téléphone du parent doit contenir uniquement des chiffres.";
    else if (formData.parent.telephone_parent.length !== 10) {
      validationErrors.telephone_parent =
        "Le téléphone du parent doit contenir 10 chiffres.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    console.log(formData);

    try {
      const response = await fetch("/api/student/student", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Étudiant mis à jour avec succès!");
        // onUpdate(formData);
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        toast.error(errorData.error || "Erreur lors de la mise à jour de l'étudiant");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données", error);
      toast.error("Une erreur inconnue est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (

 
 
    <div className={styles.modalOverlay}>
          
           <ToastContainer position="bottom-right" />
      <div className={`${styles.modalContent} ${formStyles.modalEditContent}`}>
        <button onClick={onClose} className={styles.closeButton}>
          <span className={styles.text}>Fermer</span>
          <span className={styles.icon}>
            <IoClose />
          </span>
        </button>

        <h2>Modifier l&apos;étudiant</h2>

        <form onSubmit={handleSubmit} className={formStyles.form}>
          <h3>Informations de l&apos;étudiant</h3>
          <div className={formStyles.row}>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="matricule">Matricule</label>
                <input
                  type="text"
                  id="matricule"
                  name="matricule"
                  value={formData.matricule}
                  onChange={(e) => handleInputChange("matricule", e.target.value)}
                  className={errors.matricule ? formStyles.inputError : ""}
                />
                {errors.matricule && (
                  <p className={formStyles.error}>{errors.matricule}</p>
                )}
              </div>
            </div>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="nom_etudiant">Nom</label>
                <input
                  type="text"
                  id="nom_etudiant"
                  name="nom_etudiant"
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  className={errors.nom ? formStyles.inputError : ""}
                />
                {errors.nom && <p className={formStyles.error}>{errors.nom}</p>}
              </div>
            </div>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="prenom_etudiant">Prénoms</label>
                <input
                  type="text"
                  id="prenom_etudiant"
                  name="prenom_etudiant"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange("prenom", e.target.value)}
                  className={errors.prenom ? formStyles.inputError : ""}
                />
                {errors.prenom && <p className={formStyles.error}>{errors.prenom}</p>}
              </div>
            </div>
          </div>
          <div className={formStyles.row}>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="telephone">Téléphone</label>
                <input
                  type="text"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                  className={errors.telephone ? formStyles.inputError : ""}
                />
                {errors.telephone && (
                  <p className={formStyles.error}>{errors.telephone}</p>
                )}
              </div>
            </div>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? formStyles.inputError : ""}
                />
                {errors.email && <p className={formStyles.error}>{errors.email}</p>}
              </div>
            </div>
          </div>
          <div className={formStyles.row}>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="niveau">Niveau</label>
                <select
                  id="niveau"
                  name="niveau"
                  value={formData.niveau}
                  onChange={(e) => handleInputChange("niveau", e.target.value)}
                  className={errors.niveau ? formStyles.inputError : ""}
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="Licence">Licence</option>
                  <option value="Master">Master</option>
                </select>
                {errors.niveau && <p className={formStyles.error}>{errors.niveau}</p>}
              </div>
            </div>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="classe">Classe</label>
                <select
                  id="classe"
                  name="classe"
                  value={formData.classe}
                  onChange={(e) => handleInputChange("classe", e.target.value)}
                  className={errors.classe ? formStyles.inputError : ""}
                >
                  <option value="">Sélectionner une classe</option>
                  {classesByNiveau[formData.niveau]?.map((classe) => (
                    <option key={classe.id} value={classe.nom}>
                      {classe.nom}
                    </option>
                  ))}
                </select>
                {errors.classe && <p className={formStyles.error}>{errors.classe}</p>}
              </div>
            </div>
          </div>
          <h3>Informations du parent</h3>
          <div className={formStyles.row}>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="nom_complet_parent">Nom complet</label>
                <input
                  type="text"
                  id="nom_complet_parent"
                  name="nom_complet_parent"
                  value={formData.parent.nom_complet_parent}
                  onChange={(e) =>
                    handleParentInputChange("nom_complet_parent", e.target.value)
                  }
                  className={errors.nom_complet_parent ? formStyles.inputError : ""}
                />
                {errors.nom_complet_parent && (
                  <p className={formStyles.error}>{errors.nom_complet_parent}</p>
                )}
              </div>
            </div>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="email_parent">Email</label>
                <input
                  type="email"
                  id="email_parent"
                  name="email_parent"
                  value={formData.parent.email_parent}
                  onChange={(e) =>
                    handleParentInputChange("email_parent", e.target.value)
                  }
                  className={errors.email_parent ? formStyles.inputError : ""}
                />
                {errors.email_parent && (
                  <p className={formStyles.error}>{errors.email_parent}</p>
                )}
              </div>
            </div>
            <div className={formStyles.col}>
              <div className={formStyles.formGroup}>
                <label htmlFor="telephone_parent">Téléphone</label>
                <input
                  type="text"
                  id="telephone_parent"
                  name="telephone_parent"
                  value={formData.parent.telephone_parent}
                  onChange={(e) =>
                    handleParentInputChange("telephone_parent", e.target.value)
                  }
                  className={errors.telephone_parent ? formStyles.inputError : ""}
                />
                {errors.telephone_parent && (
                  <p className={formStyles.error}>{errors.telephone_parent}</p>
                )}
              </div>
            </div>
          </div>
          {isLoading ? (
            <LoaderForm />
          ) : (
            <Validate icon={<IoSave />} text="Mettre à jour" />
          )}
        </form>
      </div>
    </div>
   
  );
};

export default ModalEditStudent;