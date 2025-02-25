import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";
import Validate from "@/pages/components/buttons/validate/Validate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles.module.css";

// Interface pour le form data
interface FormData {
  objectifsSeance: string;
  tachesEffectuees: string;
  dateSeance: string;
  heureSeance: string;
  dureeSeance: string;
  tachesProchaineSeance: string;
  observation: string;
  typeSeance: string;
  suiviId: string; // Ajout de suiviId
}

interface Errors {
  objectifsSeance?: string;
  tachesEffectuees?: string;
  dateSeance?: string;
  heureSeance?: string;
  dureeSeance?: string;
  tachesProchaineSeance?: string;
  observation?: string;
  typeSeance?: string;
}

interface FormAddRapportProps {
  suiviId: string;
}

const FormAddRapport: React.FC<FormAddRapportProps> = ({ suiviId }) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormData>({
    objectifsSeance: "",
    tachesEffectuees: "",
    dateSeance: today,
    heureSeance: "",
    dureeSeance: "90",
    tachesProchaineSeance: "",
    observation: "",
    typeSeance: "",
    suiviId: suiviId,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Errors = {};
    if (!formData.objectifsSeance.trim()) {
      newErrors.objectifsSeance = "Les objectifs de la séance sont requis.";
    }
    if (!formData.tachesEffectuees.trim()) {
      newErrors.tachesEffectuees = "Les tâches effectuées sont requises.";
    }
    if (!formData.dureeSeance.trim() || isNaN(Number(formData.dureeSeance))) {
      newErrors.dureeSeance =
        "La durée de la séance est requise et doit être un nombre.";
    }
    if (!formData.dateSeance.trim()) {
      newErrors.dateSeance = "La date de la séance est requise.";
    }
    if (!formData.heureSeance.trim()) {
      newErrors.heureSeance = "L'heure de la séance est requise.";
    }
    if (!formData.tachesProchaineSeance.trim()) {
      newErrors.tachesProchaineSeance =
        "Les tâches pour la prochaine séance sont requises.";
    }
    if (!formData.observation.trim()) {
      newErrors.observation = "L'observation est requise.";
    }
    if (!formData.typeSeance.trim()) {
      // Vérification de typeSeance
      newErrors.typeSeance = "Le type de séance est requis.";
    }

    setErrors(newErrors);
    console.log(formData);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/teacher/rapports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const responseData = await response.json();

        if (response.ok) {
          setFormData({
            objectifsSeance: "",
            tachesEffectuees: "",
            dateSeance: today,
            heureSeance: "",
            dureeSeance: "90",
            tachesProchaineSeance: "",
            observation: "",
            typeSeance: "",
            suiviId: suiviId,
          });
          window.location.reload();
        } else {
          toast.error(
            responseData.message || "Erreur lors de l'ajout du rapport."
          );
        }
      } catch (error) {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        console.log("Erreur :", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="typeSeance">Type de la séance</label>
              <select
                id="typeSeance"
                name="typeSeance"
                value={formData.typeSeance}
                onChange={(e) =>
                  handleInputChange("typeSeance", e.target.value)
                }
                className={errors.typeSeance ? styles.inputError : ""}
              >
                <option value="">
                  -- Sélectionnez le type de la séance --
                </option>
                <option value="Séance analytique">Séance analytique</option>
                <option value="Séance architecturale">
                  Séance architecturale
                </option>
              </select>
              {errors.typeSeance && (
                <p className={styles.error}>{errors.typeSeance}</p>
              )}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="objectifsSeance">Objectifs de la séance</label>
              <textarea
                id="objectifsSeance"
                name="objectifsSeance"
                rows={4}
                value={formData.objectifsSeance}
                onChange={(e) =>
                  handleInputChange("objectifsSeance", e.target.value)
                }
                className={errors.objectifsSeance ? styles.inputError : ""}
              />
              {errors.objectifsSeance && (
                <p className={styles.error}>{errors.objectifsSeance}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="tachesEffectuees">Tâches effectuées</label>
              <textarea
                id="tachesEffectuees"
                name="tachesEffectuees"
                rows={4}
                value={formData.tachesEffectuees}
                onChange={(e) =>
                  handleInputChange("tachesEffectuees", e.target.value)
                }
                className={errors.tachesEffectuees ? styles.inputError : ""}
              />
              {errors.tachesEffectuees && (
                <p className={styles.error}>{errors.tachesEffectuees}</p>
              )}
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="dateSeance">Date de la séance</label>
              <input
                type="date"
                id="dateSeance"
                name="dateSeance"
                value={formData.dateSeance}
                onChange={(e) =>
                  handleInputChange("dateSeance", e.target.value)
                }
                className={errors.dateSeance ? styles.inputError : ""}
              />
              {errors.dateSeance && (
                <p className={styles.error}>{errors.dateSeance}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="heureSeance">Heure de la séance</label>
              <input
                type="time"
                id="heureSeance"
                name="heureSeance"
                value={formData.heureSeance}
                onChange={(e) =>
                  handleInputChange("heureSeance", e.target.value)
                }
                className={errors.heureSeance ? styles.inputError : ""}
              />
              {errors.heureSeance && (
                <p className={styles.error}>{errors.heureSeance}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dureeSeance">
                Durée de la séance (en minutes)
              </label>
              <input
                type="text"
                id="dureeSeance"
                name="dureeSeance"
                value={formData.dureeSeance}
                onChange={(e) =>
                  handleInputChange("dureeSeance", e.target.value)
                }
                className={errors.dureeSeance ? styles.inputError : ""}
              />
              {errors.dureeSeance && (
                <p className={styles.error}>{errors.dureeSeance}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="tachesProchaineSeance">
                Tâches pour la prochaine séance
              </label>
              <textarea
                id="tachesProchaineSeance"
                name="tachesProchaineSeance"
                rows={4}
                value={formData.tachesProchaineSeance}
                onChange={(e) =>
                  handleInputChange("tachesProchaineSeance", e.target.value)
                }
                className={
                  errors.tachesProchaineSeance ? styles.inputError : ""
                }
              />
              {errors.tachesProchaineSeance && (
                <p className={styles.error}>{errors.tachesProchaineSeance}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="observation">Observation</label>
              <textarea
                id="observation"
                name="observation"
                rows={4}
                value={formData.observation}
                onChange={(e) =>
                  handleInputChange("observation", e.target.value)
                }
                className={errors.observation ? styles.inputError : ""}
              />
              {errors.observation && (
                <p className={styles.error}>{errors.observation}</p>
              )}
            </div>
          </div>
        </div>
        <div>
          {isLoading ? (
            <LoaderForm />
          ) : (
            <Validate icon={<IoSend />} text="Envoyer" />
          )}
        </div>
      </form>
    </>
  );
};

export default FormAddRapport;
