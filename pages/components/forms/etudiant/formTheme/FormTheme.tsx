import React, { useState, useEffect } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import TableThemes from "@/pages/components/tables/etudiant/tableThemes/TableThemes";
import { IoAdd } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  theme: string;
}

interface FormErrors {
  theme?: string;
}

export default function FormTheme() {
  const [formData, setFormData] = useState<FormData>({
    theme: "",
  });
  const [themes, setThemes] = useState<any[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingGetThemes, setIsLoadingGetThemes] = useState<boolean>(false);

  // Récupérer la liste des thèmes
  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoadingGetThemes(true);
      try {
        const response = await fetch("/api/theme/theme", {
          method: "GET",
        });
        const data = await response.json();

        if (data && Array.isArray(data.theme)) {
          setThemes(data.theme);
        } else {
          toast.error("Aucune donnée trouvée");
        }
      } catch (error) {
        toast.error(`Une erreur est survenue lors du chargement des thèmes. ${error}`);
      } finally {
        setIsLoadingGetThemes(false);
      }
    };

    fetchThemes();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.theme) {
      newErrors.theme = "Le thème est requis.";
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
      const response = await fetch("/api/theme/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || "Thème ajouté avec succès !");
        console.log(responseData.theme)
        // Ajouter le nouveau thème à la liste des thèmes
        setThemes((prevThemes) => [...prevThemes, responseData.theme]);

        // Réinitialiser le formulaire
        setFormData({ theme: "" });
      } else {
        toast.error(responseData.message || "Erreur lors de l'ajout du thème.");
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
        <div className={styles.formGroup}>
          <label htmlFor="theme">Nom du Thème</label>
          <textarea
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={(e) => handleInputChange("theme", e.target.value)}
            className={errors.theme ? styles.inputError : ""}
          />
          {errors.theme && <p className={styles.error}>{errors.theme}</p>}
        </div>

        {isLoading ? (
          <LoaderForm />
        ) : (
          <Validate icon={<IoAdd />} text="Ajouter le thème" />
        )}
      </form>

      {isLoadingGetThemes ? (
        <div style={{ textAlign: "center" }}>Chargement...</div>
      ) : (
        <TableThemes themes={themes} setThemes={setThemes} />
      )}
    </>
  );
}
