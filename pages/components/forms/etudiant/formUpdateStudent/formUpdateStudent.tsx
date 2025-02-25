import React, { useState, useEffect, FormEvent } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoAdd } from "react-icons/io5";

interface FormData {
  matricule:string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  niveau:string;
  classe:string;
  photo?:string
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
}

export default function FormUpdateStudent() {
    
  const [formData, setFormData] = useState<FormData>({
    matricule:"",
    nom: "",
    prenom: "",
    niveau:"",
    classe:"",
    telephone:"",
    email: "",
    photo: "",
    
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
        
        const response = await fetch(`/api/admin/profil`, {
          method: "GET",
        });
        const data = await response.json();
       
       
        setFormData({
            matricule:data.user.matricule,
            nom: data.user.nom,
            prenom: data.user.prenom,
            telephone:data.user.telephone,
            email: data.user.email,
            niveau:data.user.niveau,
            classe:data.user.classe,
            photo:data.user.photo
          });
      } catch (error) {
        console.error(error);
      }
    };
    const fetchClass = async () => {
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
    fetchClass();
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

    

    setErrors(validationErrors);
    

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/profil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Mise à jour effectuée avec succès !");
        // setFormData({
          
        //   nom: "",
        //   prenom: "",
        //   telephone: "",
        //   email: "",
        //   fonction:"",
        //   photo:""
        // });
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || {});
        toast.error(errorData.error || "Erreur lors de la mise à jour");
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
        <h2>Informations personnelles</h2>
        <div className={styles.row}>
          
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
              <label htmlFor="telephone">Matricule</label>
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
          
        </div>
        <div className={styles.row}>
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
        
        {isLoading ? (
          <LoaderForm />
        ) : (
          <Validate icon={<IoAdd />} text="Modifier" />
        )}
      </form>
    </>
  );
}
