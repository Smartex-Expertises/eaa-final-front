import React, { useState, useEffect } from "react";
import { IoLink } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles.module.css";
import Validate from "@/pages/components/buttons/validate/Validate";
import LoaderForm from "@/pages/components/loaders/loaderForm/LoaderForm";

export default function FormAssignTeacherStudentMaster() {
  const [formData, setFormData] = useState<{
    id_etudiant: string;
    id_enseignants: string[];
  }>({
    id_etudiant: "",
    id_enseignants: [],
  });

  const [students, setStudents] = useState<any[]>([]);
  const [teachersArchitecte, setTeachersArchitecte] = useState<any[]>([]);
  const [teachersUniversitaire, setTeachersUniversitaire] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await fetch("/api/encadrement/getStudent", {
          method: "GET",
        });
        const studentResult = await studentResponse.json();
        const filteredStudents = studentResult.etudiants_sans_encadrant
          .filter((student: any) => student.niveau === "Master")
          .map((student: any) => ({
            id_etudiant: student.id_etudiant,
            nom: student.nom,
            prenom: student.prenom,
            niveau: student.niveau,
          }));
        setStudents(filteredStudents);

        const teacherResponse = await fetch("/api/encadrement/getTeacher", {
          method: "GET",
        });
        const teacherResult = await teacherResponse.json();
        const architects = teacherResult.enseignants_disponibles.filter(
          (teacher: any) => teacher.type === "Architecte"
        );
        const universitaires = teacherResult.enseignants_disponibles.filter(
          (teacher: any) => teacher.type === "Non architecte"
        );

        const formattedArchitects = architects.map((teacher: any) => ({
          id_enseignant: teacher.id_enseignant,
          nom_complet: `${teacher.nom} ${teacher.prenom}`,
        }));

        const formattedUniversitaires = universitaires.map((teacher: any) => ({
          id_enseignant: teacher.id_enseignant,
          nom_complet: `${teacher.nom} ${teacher.prenom}`,
        }));

        setTeachersArchitecte(formattedArchitects);
        setTeachersUniversitaire(formattedUniversitaires);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleTeacherChange = (index: number, value: string) => {
    const newTeachers = [...formData.id_enseignants];
    newTeachers[index] = value;
    setFormData({
      ...formData,
      id_enseignants: newTeachers,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};
    if (!formData.id_etudiant) newErrors.id_etudiant = "Étudiant requis";
    if (!formData.id_enseignants[0])
      newErrors.id_enseignants_0 = "Encadrant Architecte requis";
    if (!formData.id_enseignants[1])
      newErrors.id_enseignants_1 = "Encadrant Non architecte requis";

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

        if (response.ok) {
          toast.success("Relation d'encadrement ajoutée avec succès");
          setErrors({});
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
          setTeachersUniversitaire((prevTeachers) =>
            prevTeachers.filter(
              (teacher) =>
                teacher.id_enseignant !== Number(formData.id_enseignants[1])
            )
          );
        } else {
          toast.error("Erreur lors de l'ajout de la relation d'encadrement");
        }
      } catch (error) {
        console.error("Erreur lors de la soumission :", error);
        toast.error("Erreur lors de la soumission");
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
              <label htmlFor="id_etudiant">Étudiants Master</label>
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
              <label htmlFor="id_encadrant_1">Encadrant Architecte</label>
              <select
                id="id_encadrant_1"
                name="id_encadrant_1"
                value={formData.id_enseignants[0] || ""}
                onChange={(e) => handleTeacherChange(0, e.target.value)}
                className={errors.id_enseignants_0 ? styles.inputError : ""}
              >
                <option value="">
                  -- Sélectionnez un encadrant Architecte --
                </option>
                {teachersArchitecte.map((teacher) => (
                  <option
                    key={teacher.id_enseignant}
                    value={teacher.id_enseignant}
                  >
                    {teacher.nom_complet || `${teacher.nom} ${teacher.prenom}`}
                  </option>
                ))}
              </select>
              {errors.id_enseignants_0 && (
                <p className={styles.error}>{errors.id_enseignants_0}</p>
              )}
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label htmlFor="id_encadrant_2">Encadrant non architecte</label>
              <select
                id="id_encadrant_2"
                name="id_encadrant_2"
                value={formData.id_enseignants[1] || ""}
                onChange={(e) => handleTeacherChange(1, e.target.value)}
                className={errors.id_enseignants_1 ? styles.inputError : ""}
              >
                <option value="">
                  -- Sélectionnez un encadrant non architecte --
                </option>
                {teachersUniversitaire.map((teacher) => (
                  <option
                    key={teacher.id_enseignant}
                    value={teacher.id_enseignant}
                  >
                    {teacher.nom_complet || `${teacher.nom} ${teacher.prenom}`}
                  </option>
                ))}
              </select>
              {errors.id_enseignants_1 && (
                <p className={styles.error}>{errors.id_enseignants_1}</p>
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
