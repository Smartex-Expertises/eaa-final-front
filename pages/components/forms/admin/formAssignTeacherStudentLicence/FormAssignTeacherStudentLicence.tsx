import React, { useState, useEffect } from "react";
import { IoLink } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";

interface Student {
  id_etudiant: number;
  nom: string;
  prenom: string;
  niveau?: string;
}

interface Teacher {
  id_enseignant: number;
  nom_complet: string;
}

export default function FormAssignTeacherStudentLicence() {
  const [formData, setFormData] = useState<{
    id_etudiant: string;
    id_enseignants: string[];
  }>({
    id_etudiant: "",
    id_enseignants: [],
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [teachersArchitecte, setTeachersArchitecte] = useState<Teacher[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/encadrement/getStudent", {
          method: "GET",
        });
        const result = await response.json();
        const filteredStudents = result.etudiants_sans_encadrant
          .filter((student: any) => student.niveau === "Licence")
          .map((student: any) => ({
            id_etudiant: student.id_etudiant,
            nom: student.nom,
            prenom: student.prenom,
            niveau: student.niveau,
          }));
        setStudents(filteredStudents);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/encadrement/getTeacher", {
          method: "GET",
        });
        const result = await response.json();
        const architects = result.enseignants_disponibles.filter(
          (teacher: any) => teacher.type === "Architecte"
        );
        const formattedArchitects = architects.map((teacher: any) => ({
          id_enseignant: teacher.id_enseignant,
          nom_complet: `${teacher.nom} ${teacher.prenom}`,
        }));
        setTeachersArchitecte(formattedArchitects);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    if (field === "id_enseignants") {
      setFormData((prevState) => ({
        ...prevState,
        [field]: [value],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.id_etudiant) newErrors.id_etudiant = "Étudiant requis";
    if (formData.id_enseignants.length === 0)
      newErrors.id_enseignants = "Encadrant requis";
    console.log(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsLoading(true);
      try {
        const response = await fetch("/api/encadrement/encadrement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (response.ok) {
          toast.success("Relation d'encadrement ajoutée avec succès");

          // Réinitialisation de l'erreur et de la liste
          setErrors({});

          // Mettre à jour les listes localement
          setStudents((prevStudents) =>
            prevStudents.filter(
              (student) => student.id_etudiant !== Number(formData.id_etudiant)
            )
          );
          setTeachersArchitecte((prevTeachers) =>
            prevTeachers.filter(
              (teacher) =>
                teacher.id_enseignant !== Number(formData.id_enseignants[0])
            )
          );

          // Réinitialiser le formulaire
          setFormData({
            id_etudiant: "",
            id_enseignants: [],
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
              <label htmlFor="id_etudiant">Étudiants Licence</label>
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
                    {student.nom} {student.prenom}
                  </option>
                ))}
              </select>
              {errors.id_etudiant && (
                <p className={styles.error}>{errors.id_etudiant}</p>
              )}
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="id_enseignants">Encadrant Architecte</label>
              <select
                id="id_enseignants"
                name="id_enseignants"
                value={formData.id_enseignants[0] || ""}
                onChange={(e) =>
                  handleInputChange("id_enseignants", e.target.value)
                }
                className={errors.id_enseignants ? styles.inputError : ""}
              >
                <option value="">-- Sélectionnez un encadrant --</option>
                {teachersArchitecte.map((teacher) => (
                  <option
                    key={teacher.id_enseignant}
                    value={teacher.id_enseignant}
                  >
                    {teacher.nom_complet}
                  </option>
                ))}
              </select>
              {errors.id_enseignants && (
                <p className={styles.error}>{errors.id_enseignants}</p>
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
