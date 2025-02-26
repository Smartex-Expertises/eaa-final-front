import React, { useState, useMemo, useEffect } from "react";
import { IoArrowUndo, IoArrowRedoSharp, IoEye } from "react-icons/io5";
import styles from "../../table.module.css";
import ModalDisplayStudent from "@/pages/components/modals/modalDisplayStudents/ModalDisplayStudents";

interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom_etudiant: string;
  prenom_etudiant: string;
  niveau: string;
  classe: string;
}

interface Expert {
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
  email: string;
  etudiants: Etudiant[];
}

interface TableProps {
  data: Expert[];
}

export default function TableExperts({ data }: TableProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStudents, setSelectedStudents] = useState<Etudiant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const headers = [
    "Nom",
    "Prénom",
    "Spécialité",
    "Téléphone",
    "Email",
    "Action",
  ];
  const itemsPerPage = 10;

  // Utilisation de useMemo pour ne recalculer filteredData que si la recherche ou les données changent
  const filteredData = useMemo(() => {
    return data ? data.filter((row) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          row.nom.toLowerCase().includes(searchLower) ||
          row.prenom.toLowerCase().includes(searchLower) ||
          row.specialite.toLowerCase().includes(searchLower) ||
          row.telephone.toLowerCase().includes(searchLower) ||
          row.email.toLowerCase().includes(searchLower)
        );
      }
      return true;
    }) : [];
  }, [data, searchQuery]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData ? filteredData.length : 0 / itemsPerPage);

  const changePage = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(nextPage);
  };

  const showStudents = (students: Etudiant[]) => {
    const formattedStudents = students ? students.map((student) => ({
      id_etudiant: student.id_etudiant,
      matricule: student.matricule,
      nom_etudiant: student.nom_etudiant,
      prenom_etudiant: student.prenom_etudiant,
      niveau: student.niveau,
      classe: student.classe,
    })) : [];

    // Vérification dans la console pour voir les données formatées
    console.log("formattedStudents:", formattedStudents);

    setSelectedStudents(formattedStudents);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudents([]); // Clear selected students on modal close
  };

  // Log des selectedStudents chaque fois qu'il change
  useEffect(() => {
    console.log("selectedStudents mis à jour:", selectedStudents);
  }, [selectedStudents]);

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Recherche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Barre de recherche"
        />
      </div>

      <div className={styles.tableWrapper}>
        {filteredData && filteredData.length === 0 ? (
          <p className={styles.noData}>Aucun expert trouvé.</p>
        ) : (
          <table className={styles.styledTable}>
            <thead>
              <tr>
                {headers && headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData && currentData.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 1 ? styles.alternateRow : ""}
                >
                  <td>{row.nom}</td>
                  <td>{row.prenom}</td>
                  <td>{row.specialite}</td>
                  <td>{row.telephone}</td>
                  <td>{row.email}</td>
                  <td>
                    <button
                      onClick={() => showStudents(row.etudiants)}
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
            className={styles.paginationButton}
            aria-label="Page précédente"
          >
            <IoArrowUndo />
          </button>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
            aria-label="Page suivante"
          >
            <IoArrowRedoSharp />
          </button>
        </div>
      )}

      {/* Affichage du modal si ouvert */}
      {isModalOpen && selectedStudents && (
        <ModalDisplayStudent
          isOpen={isModalOpen}
          onClose={closeModal}
          etudiants={selectedStudents}
        />
      )}
    </div>
  );
}
