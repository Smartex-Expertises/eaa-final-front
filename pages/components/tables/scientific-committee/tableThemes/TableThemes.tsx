import React, { useState } from "react";
import { IoEye, IoArrowUndo, IoArrowRedoSharp } from "react-icons/io5";
import styles from "../../table.module.css";
import ThemesList from "@/pages/components/listes/scientific-committee/themesList/ThemesList";

// Types pour les données
type Theme = {
  id_theme: number;
  theme: string;
  status: number;
};

type Student = {
  id_etudiant: number;
  matricule: string;
  nom: string;
  prenom: string;
  niveau: string;
  classe: string;
  themes: Theme[];
};

type TableThemesProps = {
  studentsThemes: Student[];
};

export default function TableThemes({ studentsThemes }: TableThemesProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const handleViewThemes = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleValidateTheme = async (id_theme: number) => {
    if (!selectedStudent) return;

    try {
      const response = await fetch("/api/theme/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id_theme }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la validation du thème");
      }

      const updatedThemes = selectedStudent.themes.map((theme) => ({
        ...theme,
        status: theme.id_theme === id_theme ? 1 : 0,
      }));

      setSelectedStudent({ ...selectedStudent, themes: updatedThemes });
    } catch (error) {
      console.error(error);
    }
  };

  // Filtrage des données
  const filteredData = studentsThemes.filter((student) => {
    const matchesSearch =
      student.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.prenom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel
      ? student.niveau === selectedLevel
      : true;
    const matchesClass = selectedClass
      ? student.classe === selectedClass
      : true;

    return matchesSearch && matchesLevel && matchesClass;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Récupération des classes uniques pour le filtre
  const classesToDisplay = Array.from(
    new Set(
      studentsThemes
        .filter((student) =>
          selectedLevel ? student.niveau === selectedLevel : true
        )
        .map((student) => student.classe)
    )
  );

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Liste des étudiants */}
      <div className={styles.container} style={{ flex: "1" }}>
        {/* Filtres */}
        <div className={styles.filterContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Recherche par matricule, nom ou prénom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setSelectedClass(""); // Reset selected class when level changes
              }}
              className={styles.selectFilter}
            >
              <option value="">-- Filtrer par Niveau --</option>
              <option value="Licence">Licence</option>
              <option value="Master">Master</option>
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={styles.selectFilter}
            >
              <option value="">-- Filtrer par Classe --</option>
              {classesToDisplay.map((classe, index) => (
                <option key={index} value={classe}>
                  {classe}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table des étudiants */}
        <div className={styles.tableWrapper}>
          {currentData.length === 0 ? (
            <p className={styles.noData}>Aucun étudiant</p>
          ) : (
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Etudiant</th>
                  <th>Niveau</th>
                  <th>Classe</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((student) => (
                  <tr key={student.id_etudiant}>
                    <th>{student.matricule}</th>
                    <td>
                      {student.nom} {student.prenom}
                    </td>
                    <td>{student.niveau}</td>
                    <td>{student.classe}</td>
                    <td>
                      <button
                        onClick={() => handleViewThemes(student)}
                        className={`${styles.btnAction} ${styles.btnVoir}`}
                      >
                        <span className={styles.text}>Thèmes</span>
                        <span className={styles.icon}>
                          <IoEye />
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredData.length > 0 && (
          <div className={styles.pagination}>
            <span>{`Page ${currentPage} sur ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IoArrowUndo />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IoArrowRedoSharp />
            </button>
          </div>
        )}
      </div>

      {/* Thèmes pour l'étudiant sélectionné */}
      <div style={{ flex: "1" }}>
        {selectedStudent ? (
          <div>
            <h3>
              Thèmes proposés par {selectedStudent.nom} {selectedStudent.prenom}
            </h3>
            {/* Utilisation du composant ThemesList pour afficher les thèmes */}
            <ThemesList
              themes={selectedStudent.themes}
              onValidateTheme={handleValidateTheme}
            />
          </div>
        ) : (
          <p>Sélectionnez un étudiant pour afficher ses thèmes.</p>
        )}
      </div>
    </div>
  );
}
