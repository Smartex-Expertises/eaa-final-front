import React, { useState, useEffect } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  limiteLicenceArchitectes: string;
  limiteMasterArchitectes: string;
  limiteMasterNonArchitectes: string;
}

interface FormErrors {
  limiteLicenceArchitectes?: string;
  limiteMasterArchitectes?: string;
  limiteMasterNonArchitectes?: string;
}

export default function FormCotas() {
  const [formData, setFormData] = useState<FormData>({
    limiteLicenceArchitectes: "",
    limiteMasterArchitectes: "",
    limiteMasterNonArchitectes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    limiteLicenceArchitectes: "",
    limiteMasterArchitectes: "",
    limiteMasterNonArchitectes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.limiteLicenceArchitectes) {
      newErrors.limiteLicenceArchitectes =
        "Limite requise pour les architectes en licence.";
    }

    if (!formData.limiteMasterArchitectes) {
      newErrors.limiteMasterArchitectes =
        "Limite requise pour les architectes en master.";
    }

    if (!formData.limiteMasterNonArchitectes) {
      newErrors.limiteMasterNonArchitectes =
        "Limite requise pour les non architectes en master.";
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
      const response = await fetch("/api/cotas/cotas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Cotas mis à jour avec succès !");
      } else {
        toast.error(
          "Erreur lors de la mise à jour des cotas."
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/cotas/cotas", {
          method: "GET",
        });
        const data = await response.json();
        setFormData({
          limiteLicenceArchitectes: data.limite_licence_architectes,
          limiteMasterArchitectes: data.limite_master_architectes,
          limiteMasterNonArchitectes: data.limite_master_non_architectes,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit} style={{ padding: "5rem" }}>
      <ToastContainer position="bottom-right" />

      <div className={styles.formGroup}>
        <label htmlFor="limiteLicenceArchitectes" className={styles.label}>
          Limite d&apos;étudiants en licence pour les architectes
        </label>
        <input
          type="number"
          id="limiteLicenceArchitectes"
          name="limiteLicenceArchitectes"
          value={formData.limiteLicenceArchitectes}
          onChange={(e) =>
            handleInputChange("limiteLicenceArchitectes", e.target.value)
          }
          className={`${styles.input} ${
            errors.limiteLicenceArchitectes ? styles.inputError : ""
          }`}
          min={1}
        />
        {errors.limiteLicenceArchitectes && (
          <p className={styles.error}>{errors.limiteLicenceArchitectes}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="limiteMasterArchitectes" className={styles.label}>
          Limite d&apos;étudiants en master pour les architectes
        </label>
        <input
          type="number"
          id="limiteMasterArchitectes"
          name="limiteMasterArchitectes"
          value={formData.limiteMasterArchitectes}
          onChange={(e) =>
            handleInputChange("limiteMasterArchitectes", e.target.value)
          }
          className={`${styles.input} ${
            errors.limiteMasterArchitectes ? styles.inputError : ""
          }`}
          min={1}
        />
        {errors.limiteMasterArchitectes && (
          <p className={styles.error}>{errors.limiteMasterArchitectes}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="limiteMasterNonArchitectes" className={styles.label}>
          Limite d&apos;étudiants en master pour les non architectes
        </label>
        <input
          type="number"
          id="limiteMasterNonArchitectes"
          name="limiteMasterNonArchitectes"
          value={formData.limiteMasterNonArchitectes}
          onChange={(e) =>
            handleInputChange("limiteMasterNonArchitectes", e.target.value)
          }
          className={`${styles.input} ${
            errors.limiteMasterNonArchitectes ? styles.inputError : ""
          }`}
          min={1}
        />
        {errors.limiteMasterNonArchitectes && (
          <p className={styles.error}>{errors.limiteMasterNonArchitectes}</p>
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
