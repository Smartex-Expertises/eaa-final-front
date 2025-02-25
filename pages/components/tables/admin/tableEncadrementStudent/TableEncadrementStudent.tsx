import React, { useState, useEffect } from "react";
import { IoArrowUndo, IoArrowRedoSharp, IoEye } from "react-icons/io5";
import ModalDisplayTeacher from "../../../modals/modalDisplayTeachers/ModalDisplayTeacher";
import styles from "../../table.module.css";

interface Encadrant {
  id_enseignant: number;
  nom_enseignant: string;
  prenom_enseignant: string;
  type: string;
}

interface Student {
  id_etudiant: number;
  matricule: string;
  nom_etudiant: string;
  prenom_etudiant: string;
  niveau: string;
  classe: string;
  encadrants: Encadrant[];
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
}

interface TableProps {
  data: Student[];
}

const TableEncadrementStudent: React.FC<TableProps> = ({ data }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEncadrants, setSelectedEncadrants] = useState<Encadrant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [classesByNiveau, setClassesByNiveau] = useState<{
    [key: string]: Classe[];
  }>({
    Licence: [],
    Master: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/class/class", {
          method: "GET",
        });
        const data = await response.json();
        const classesByLevel = {
          Licence: data.data.filter(
            (classe: any) => classe.niveau === "Licence"
          ),
          Master: data.data.filter((classe: any) => classe.niveau === "Master"),
        };
        setClassesByNiveau(classesByLevel);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const headers = ["Matricule", "Nom", "Prénoms", "Niveau", "Classe", "Action"];
  const itemsPerPage = 10;

  const filteredData = data.filter((student) => {
    if (selectedLevel && student.niveau !== selectedLevel) {
      return false;
    }
    if (selectedClass && student.classe !== selectedClass) {
      return false;
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        student.matricule.toLowerCase().includes(searchLower) ||
        student.nom_etudiant.toLowerCase().includes(searchLower) ||
        student.prenom_etudiant.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = (encadrants: Encadrant[]) => {
    setSelectedEncadrants(encadrants);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEncadrants([]);
  };

  const classesToDisplay = selectedLevel
    ? classesByNiveau[selectedLevel]
    : Object.values(classesByNiveau).flat();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Recherche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setSelectedClass("");
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
                <option key={index} value={classe.nom}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          {filteredData.length === 0 ? (
            <p className={styles.noData}>Aucun étudiant</p>
          ) : (
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((student, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 1 ? styles.alternateRow : ""}
                  >
                    <td>{student.matricule}</td>
                    <td>{student.nom_etudiant}</td>
                    <td>{student.prenom_etudiant}</td>
                    <td>{student.niveau}</td>
                    <td>{student.classe}</td>
                    <td>
                      <button
                        onClick={() => openModal(student.encadrants)}
                        className={`${styles.btnAction} ${styles.btnVoir}`}
                      >
                        <span className={styles.text}>Directeurs</span>
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
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IoArrowUndo />
            </button>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IoArrowRedoSharp />
            </button>
          </div>
        )}

        {isModalOpen && (
          <ModalDisplayTeacher
            isOpen={isModalOpen}
            onClose={closeModal}
            encadrants={selectedEncadrants}
          />
        )}
      </div>
    </>
  );
};

export default TableEncadrementStudent;
