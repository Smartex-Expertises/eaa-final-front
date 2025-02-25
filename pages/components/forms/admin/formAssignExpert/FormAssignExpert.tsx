import React, { useState, useEffect } from "react";
import { IoLink } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";

interface Student {
  id_etudiant: string;
  nom: string;
  prenom: string;
  niveau?: string;
}

interface Expert {
  id_expert: string;
  nom_complet: string;
  specialite: string;
}

export default function FormAssignExpert() {
  const [formData, setFormData] = useState<{
    id_expert: string;
    id_etudiant: string;
  }>({
    id_expert: "",
    id_etudiant: "",
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/student/getAllStudents", {
          method: "GET",
        });
        const result = await response.json();
        const formattedStudents = result.data.map((student: any) => ({
          id_etudiant: student.id_etudiant,
          nom: student.nom,
          prenom: student.prenom,
          niveau: student.niveau,
        }));
        setStudents(formattedStudents);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await fetch("/api/expert/expert", {
          method: "GET",
        });
        const result = await response.json();
        const formattedExperts = result.data.map((expert: any) => ({
          id_expert: expert.id_expert,
          nom_complet: `${expert.nom} ${expert.prenom}`,
          specialite: expert.specialite,
        }));
        setExperts(formattedExperts);
      } catch (error) {
        console.error("Erreur lors de la récupération des encadrants :", error);
      }
    };
    fetchExperts();
  }, []);

  const handleInputChange = (
    field: "id_etudiant" | "id_expert",
    value: string
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.id_etudiant) newErrors.id_etudiant = "Étudiant requis";
    if (!formData.id_expert) newErrors.id_expert = "Expert requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsLoading(true);
      console.log(formData);
      try {
        const response = await fetch("/api/expert/assignExpert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (response.ok) {
          toast.success("Relation d'encadrement ajoutée avec succès");

          setErrors({});
          setStudents((prevStudents) =>
            prevStudents.filter(
              (student) => student.id_etudiant !== formData.id_etudiant
            )
          );

          setFormData({
            id_etudiant: "",
            id_expert: "",
          });
        } else {
          toast.error(
            responseData.message || "Erreur lors de l'ajout de la relation."
          );
        }
      } catch (error) {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
        console.error("Erreur :", error);
      } finally {
        setIsLoading(false);
      }
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
              <label htmlFor="id_expert">Experts</label>
              <select
                id="id_expert"
                name="id_expert"
                value={formData.id_expert}
                onChange={(e) => handleInputChange("id_expert", e.target.value)}
                className={errors.id_expert ? styles.inputError : ""}
              >
                <option value="">-- Sélectionnez un encadrant --</option>
                {experts.map((expert) => (
                  <option key={expert.id_expert} value={expert.id_expert}>
                    {expert.nom_complet} ({expert.specialite})
                  </option>
                ))}
              </select>
              {errors.id_expert && (
                <p className={styles.error}>{errors.id_expert}</p>
              )}
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="id_etudiant">Étudiants</label>
              <select
                id="id_etudiant"
                name="id_etudiant"
                value={formData.id_etudiant}
                onChange={(e) =>
                  handleInputChange("id_etudiant", e.target.value)
                }
                className={errors.id_etudiant ? styles.inputError : ""}
              >
                <option value="">-- Sélectionnez un étudiant --</option>
                {students.map((student) => (
                  <option key={student.id_etudiant} value={student.id_etudiant}>
                    {student.nom} {student.prenom} ({student.niveau})
                  </option>
                ))}
              </select>
              {errors.id_etudiant && (
                <p className={styles.error}>{errors.id_etudiant}</p>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoaderForm />
        ) : (
          <Validate icon={<IoLink />} text="Associer" />
        )}
      </form>
    </>
  );
}
