import React, { useState } from "react";
import { useRouter } from "next/router";
import { IoArrowUndo, IoArrowRedoSharp, IoEye } from "react-icons/io5";
import styles from "../../table.module.css"; // Assurez-vous que ce chemin est correct
import ThemeDisplay from "@/pages/components/modals/themeDisplay/ThemeDisplay";

interface Etudiant {
  nom: string;
  prenom: string;
}

interface Enseignant {
  nom: string;
  prenom: string;
}

interface Suivi {
  id_suivi: number;
  etudiant: Etudiant;
  enseignant1: Enseignant;
  theme: string | null; // Assurez-vous que le theme est bien défini ici
}

interface TableSuiviLicenceProps {
  suivis: Suivi[];
}

const TableSuiviLicence: React.FC<TableSuiviLicenceProps> = ({ suivis }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [themeToShow, setThemeToShow] = useState<string | null>(null);
  const itemsPerPage = 5;
  const router = useRouter();

  const headers = ["Nom de l'étudiant", "Directeur de mémoire", "Actions"];

  const filteredSuivis = suivis.filter((suivi) => {
    return (
      suivi.etudiant.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suivi.etudiant.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (suivi.theme
        ? suivi.theme.toLowerCase().includes(searchQuery.toLowerCase())
        : false)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuivis = filteredSuivis.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredSuivis.length / itemsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewReports = (suiviId: number) => {
    router.push(`/teacher/these/licence/${suiviId}`);
  };

  const handleViewTheme = (theme: string | null) => {
    setThemeToShow(theme);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setThemeToShow(null);
  };

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
      </div>

      <div className={styles.tableWrapper}>
        {filteredSuivis.length === 0 ? (
          <p className={styles.noData}>Aucun suivi</p>
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
              {currentSuivis.map((suivi, index) => (
                <tr
                  key={suivi.id_suivi}
                  className={index % 2 === 1 ? styles.alternateRow : ""}
                >
                  <td>
                    {suivi.etudiant.nom} {suivi.etudiant.prenom}
                  </td>
                  <td>
                    {suivi.enseignant1.nom} {suivi.enseignant1.prenom}
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewTheme(suivi.theme)}
                      className={`${styles.btnAction} ${styles.btnVoir}`}
                    >
                      <span className={styles.text}>Thème</span>
                      <span className={styles.icon}>
                        <IoEye />
                      </span>
                    </button>

                    <button
                      onClick={() => handleViewReports(suivi.id_suivi)}
                      className={`${styles.btnAction} ${styles.btnVoir}`}
                    >
                      <span className={styles.text}>Rapport</span>
                      <span className={styles.icon}>
                        <IoArrowRedoSharp />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredSuivis.length > 0 && (
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

      {/* Modal pour afficher le thème */}
      <ThemeDisplay
        isOpen={isModalOpen}
        theme={themeToShow}
        onClose={closeModal}
      />
    </div>
  );
};

export default TableSuiviLicence;
