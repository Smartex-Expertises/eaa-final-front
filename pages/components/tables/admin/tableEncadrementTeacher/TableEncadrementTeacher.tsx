import React, { useState } from "react";
import styles from "../../table.module.css";
import { IoArrowUndo, IoArrowRedoSharp, IoEye } from "react-icons/io5";
import ModalDisplayStudents from "../../../modals/modalDisplayStudents/ModalDisplayStudents";

interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom_etudiant: string;
  prenom_etudiant: string;
  niveau: string;
  classe: string;
}

export interface Encadrant {
  id_encadrant: number;
  matricule: string;
  nom_enseignant: string;
  prenom_enseignant: string;
  type: string;
  etudiants: Etudiant[];
}

interface TableProps {
  data: Encadrant[];
}

const TableEncadrementTeacher: React.FC<TableProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEncadrant, setSelectedEncadrant] = useState<Encadrant | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const openModal = (encadrant: Encadrant) => {
    setSelectedEncadrant(encadrant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEncadrant(null);
  };

  // Filtrage des données
  const filteredData = data ? data.filter((encadrant) => {
    // Filtrage par type
    if (selectedType && encadrant.type !== selectedType) {
      return false;
    }
    // Filtrage par la recherche textuelle
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        encadrant.matricule.toLowerCase().includes(searchLower) ||
        encadrant.nom_enseignant.toLowerCase().includes(searchLower) ||
        encadrant.prenom_enseignant.toLowerCase().includes(searchLower) ||
        encadrant.etudiants.some((etudiant) =>
          `${etudiant.matricule} ${etudiant.nom_etudiant} ${etudiant.prenom_etudiant}`
            .toLowerCase()
            .includes(searchLower)
        )
      );
    }
    return true;
  }) : [];

  // Pagination
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const headers = ["Matricule", "Nom", "Prénoms", "Type", "Actions"];

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Recherche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Filtre par type */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className={styles.selectFilter}
        >
          <option value="">-- Filtrer par Type --</option>
          <option value="Architecte">Architecte</option>
          <option value="Non architecte">Non architecte</option>{" "}
        </select>
      </div>

      <div className={styles.tableWrapper}>
        {filteredData && filteredData.length === 0 ? (
          <p className={styles.noData}>Aucun encadrant</p>
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
              {paginatedData.map((encadrant) => (
                <tr key={encadrant.id_encadrant}>
                  <td>{encadrant.matricule}</td>
                  <td>{encadrant.nom_enseignant}</td>
                  <td>{encadrant.prenom_enseignant}</td>
                  <td>{encadrant.type}</td>
                  <td>
                    <button
                      onClick={() => openModal(encadrant)}
                      className={`${styles.btnAction} ${styles.btnVoir}`}
                      aria-label="Voir les étudiants"
                    >
                      <span className={styles.text}>Étudiants</span>
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

      {filteredData && filteredData.length > 0 && (
        <div className={styles.pagination}>
          <span>{`Page ${currentPage} sur ${totalPages}`}</span>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Page précédente"
          >
            <IoArrowUndo />
          </button>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Page suivante"
          >
            <IoArrowRedoSharp />
          </button>
        </div>
      )}

      {isModalOpen && selectedEncadrant && (
        <ModalDisplayStudents
          isOpen={isModalOpen}
          onClose={closeModal}
          etudiants={selectedEncadrant.etudiants}
        />
      )}
    </div>
  );
};

export default TableEncadrementTeacher;
