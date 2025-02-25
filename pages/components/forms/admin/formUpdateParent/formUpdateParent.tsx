import React, { useState, useEffect, FormEvent } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoAdd } from "react-icons/io5";

interface FormData {
  
  nom_complet_parent: string;
  telephone_parent: string;
  email_parent: string;
 
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
}

export default function FormUpdateParent() {
    
  const [formData, setFormData] = useState<FormData>({
    
    nom_complet_parent: "",

    telephone_parent:"",
    email_parent: "",
    
    
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
          
            nom_complet_parent: data.user.nom_complet_parent,
            telephone_parent:data.user.telephone_parent,
            email_parent: data.user.email_parent,
            
          });
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
    
    if (!formData.nom_complet_parent) validationErrors.nom_complet = "Le nom complet est requis.";

    if (!formData.telephone_parent)
      validationErrors.telephone = "Le téléphone est requis.";
    else if (!/^\d+$/.test(formData.telephone_parent))
      validationErrors.telephone =
        "Le téléphone doit contenir uniquement des chiffres.";
    else if (formData.telephone_parent.length !== 10) {
      validationErrors.telephone = "Le téléphone doit contenir 10 chiffres.";
    }

    if (!formData.email_parent || !/\S+@\S+\.\S+/.test(formData.email_parent))
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
              <label htmlFor="nom_compet_parent">Nom complet</label>
              <input
                type="text"
                id="nom_compet_parent"
                name="nom_complet_parent"
                value={formData.nom_complet_parent}
                onChange={(e) => handleInputChange("nom_complet_parent", e.target.value)}
                className={errors.nom ? styles.inputError : ""}
              />
              {errors.nom_complet && <p className={styles.error}>{errors.nom_complet}</p>}
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
                value={formData.telephone_parent}
                onChange={(e) => handleInputChange("telephone_parent", e.target.value)}
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
                value={formData.email_parent}
                onChange={(e) => handleInputChange("email_parent", e.target.value)}
                className={errors.email ? styles.inputError : ""}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>
          </div>
        </div>
        {/* <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="niveau">Fonction</label>
              <select
                id="niveau"
                name="niveau"
                value={formData.fonction}
                onChange={(e) => handleInputChange("fonction", e.target.value)}
                className={errors.niveau ? styles.inputError : ""}
              >
                <option value="">Sélectionner un niveau</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
              </select>
              {errors.niveau && <p className={styles.error}>{errors.niveau}</p>}
            </div>
          </div>
          
        </div> */}
        
        {isLoading ? (
          <LoaderForm />
        ) : (
          <Validate icon={<IoAdd />} text="Modifier" />
        )}
      </form>
    </>
  );
}
