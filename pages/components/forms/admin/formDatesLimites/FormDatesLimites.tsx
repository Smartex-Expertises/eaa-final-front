import React, { useState, useEffect } from "react";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  dateLimiteLicence: string;
  dateLimiteMisParcoursMaster: string;
  dateLimiteFinalMaster: string;
}

interface FormErrors {
  dateLimiteLicence?: string;
  dateLimiteMisParcoursMaster?: string;
  dateLimiteFinalMaster?: string;
}

export default function FormCotas() {
  const [formData, setFormData] = useState<FormData>({
    dateLimiteLicence: "",
    dateLimiteMisParcoursMaster: "",
    dateLimiteFinalMaster: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.dateLimiteLicence) {
      newErrors.dateLimiteLicence = "Date limite requise pour la licence.";
    }

    if (!formData.dateLimiteMisParcoursMaster) {
      newErrors.dateLimiteMisParcoursMaster = "Date limite requise pour le parcours master.";
    }

    if (!formData.dateLimiteFinalMaster) {
      newErrors.dateLimiteFinalMaster = "Date limite requise pour le master final.";
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
      const response = await fetch("/api/dates/dates", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Dates limites mis à jour avec succès !");
      } else {
        toast.error(`Erreur lors de la mise à jour`);
      }
    } catch (error) {
      toast.error(`Une erreur est survenue. Veuillez réessayer.  ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dates/dates", {
          method: "GET",
        });
        const data = await response.json();
        setFormData({
          dateLimiteLicence: data.dateLimiteLicence,
          dateLimiteMisParcoursMaster: data.dateLimiteMisParcoursMaster,
          dateLimiteFinalMaster: data.dateLimiteFinalMaster,
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
        <label htmlFor="dateLimiteLicence" className={styles.label}>
          Date limite pour la licence
        </label>
        <input
          type="date"
          id="dateLimiteLicence"
          name="dateLimiteLicence"
          value={formData.dateLimiteLicence}
          onChange={(e) =>
            handleInputChange("dateLimiteLicence", e.target.value)
          }
          className={`${styles.input} ${errors.dateLimiteLicence ? styles.inputError : ""}`}
        />
        {errors.dateLimiteLicence && (
          <p className={styles.error}>{errors.dateLimiteLicence}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dateLimiteMisParcoursMaster" className={styles.label}>
          Date limite pour le parcours master
        </label>
        <input
          type="date"
          id="dateLimiteMisParcoursMaster"
          name="dateLimiteMisParcoursMaster"
          value={formData.dateLimiteMisParcoursMaster}
          onChange={(e) =>
            handleInputChange("dateLimiteMisParcoursMaster", e.target.value)
          }
          className={`${styles.input} ${errors.dateLimiteMisParcoursMaster ? styles.inputError : ""}`}
        />
        {errors.dateLimiteMisParcoursMaster && (
          <p className={styles.error}>{errors.dateLimiteMisParcoursMaster}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dateLimiteFinalMaster" className={styles.label}>
          Date limite pour le master final
        </label>
        <input
          type="date"
          id="dateLimiteFinalMaster"
          name="dateLimiteFinalMaster"
          value={formData.dateLimiteFinalMaster}
          onChange={(e) =>
            handleInputChange("dateLimiteFinalMaster", e.target.value)
          }
          className={`${styles.input} ${errors.dateLimiteFinalMaster ? styles.inputError : ""}`}
        />
        {errors.dateLimiteFinalMaster && (
          <p className={styles.error}>{errors.dateLimiteFinalMaster}</p>
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
