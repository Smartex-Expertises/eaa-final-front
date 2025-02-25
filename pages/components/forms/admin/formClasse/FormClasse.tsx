import React, { useState, useEffect } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import TableClasses from "@/pages/components/tables/admin/tableClasses/TableClasses";
import { IoAdd } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  nom: string;
  niveau: string;
}

interface FormErrors {
  nom?: string;
  niveau?: string;
}

export default function FormClasse() {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    niveau: "",
  });
  const [classes, setClasses] = useState<any[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingGetClasse, setIsLoadingGetClasse] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingGetClasse(true);
      try {
        const response = await fetch("/api/class/class", {
          method: "GET",
        });
        const data = await response.json();

        if (data && Array.isArray(data.data)) {
          setClasses(data.data);
        } else {
          toast.error("Aucune donnée trouvée");
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors du chargement des classes.");
      } finally {
        setIsLoadingGetClasse(false);
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

    if (!formData.niveau) {
      newErrors.niveau = "Le niveau est requis.";
    }

    if (!formData.nom) {
      newErrors.nom = "Le nom de la classe est requis.";
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
      const response = await fetch("/api/class/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || "Classe ajoutée avec succès !");

        setClasses((prevClasses) => [...prevClasses, responseData.classe]);
        setFormData({ nom: "", niveau: "" });
      } else {
        toast.error(
          responseData.message || "Erreur lors de l'ajout de la classe."
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
        style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
      >
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
                <option value="">-- Sélectionnez un niveau --</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
              </select>
              {errors.niveau && <p className={styles.error}>{errors.niveau}</p>}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="nomClasse">Nom de la classe</label>
              <input
                type="text"
                id="nomClasse"
                name="nomClasse"
                value={formData.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                className={errors.nom ? styles.inputError : ""}
              />
              {errors.nom && <p className={styles.error}>{errors.nom}</p>}
            </div>
          </div>
        </div>
        {isLoading ? (
          <LoaderForm />
        ) : (
          <Validate icon={<IoAdd />} text="Ajouter la classe" />
        )}
      </form>
      {isLoadingGetClasse ? (
        <div style={{ textAlign: "center" }}>Chargement...</div>
      ) : (
        <TableClasses data={classes} setData={setClasses} />
      )}
    </>
  );
}
