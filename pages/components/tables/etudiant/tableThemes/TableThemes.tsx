import React, { useState } from "react";
import ConfirmModal from "../../../modals/confirmModal/ConfirmModal";
import styles from "../../table.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowUndo, IoArrowRedoSharp, IoCloseCircle } from "react-icons/io5";

interface Theme {
  id_theme: number;
  theme: string;
  status: boolean; // booléen pour savoir si validé (true) ou en attente (false)
}

interface TableThemesProps {
  themes: Theme[];
  setThemes: React.Dispatch<React.SetStateAction<Theme[]>>;
}

export default function TableThemes({ themes, setThemes }: TableThemesProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Filtre pour le statut
  const [searchQuery, setSearchQuery] = useState<string>(""); // Filtre pour la recherche
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<number | null>(null);

  const headers = ["Nom du thème", "Statut", "Actions"];
  const itemsPerPage = 5;

  // Vérifier si un thème validé existe parmi la liste
  const isAnyThemeValidated = themes.some((theme) => theme.status === true);

  // Filtrage des thèmes en fonction du statut et de la recherche
  const filteredThemes = themes.filter((theme) => {
    // Filtrage par statut
    if (selectedStatus) {
      const statusText = theme.status ? "Validé" : "Non validé";
      if (statusText !== selectedStatus) return false;
    }

    // Filtrage par la recherche
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        theme.theme.toLowerCase().includes(searchLower) ||
        (theme.status ? "Validé" : "Non validé")
          .toLowerCase()
          .includes(searchLower)
      );
    }

    return true;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentThemes = filteredThemes.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredThemes.length / itemsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteTheme = (themeId: number) => {
    setThemeToDelete(themeId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (themeToDelete !== null) {
      try {
        const response = await fetch("/api/theme/theme", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: themeToDelete }),
        });

        const responseData = await response.json();
        if (response.ok) {
          toast.success(responseData.message || "Thème supprimé avec succès!");
          setThemes((prevThemes) =>
            prevThemes.filter((theme) => theme.id_theme !== themeToDelete)
          );
        } else {
          toast.error(
            responseData.message || "Erreur lors de la suppression du thème"
          );
        }
      } catch (error) {
        toast.error("Erreur de réseau. Impossible de supprimer le thème.");
      } finally {
        setIsModalOpen(false);
        setThemeToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setThemeToDelete(null);
  };

  // Vérifier s'il existe des thèmes validés
  const hasValidatedTheme = themes.some((theme) => theme.status);

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
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="">-- Filtrer par Statut --</option>
            <option value="Validé">Validé</option>
            <option value="Non validé">Non validé</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {filteredThemes.length === 0 ? (
          <p className={styles.noData}>Aucun thème</p>
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
              {currentThemes.map((theme, index) => (
                <tr
                  key={theme.id_theme}
                  className={index % 2 === 1 ? styles.alternateRow : ""}
                >
                  <td>{theme.theme}</td>
                  <td>{theme.status ? "Validé" : "Non validé"}</td>
                  <td>
                    {!hasValidatedTheme && !theme.status && (
                      <button
                        onClick={() => handleDeleteTheme(theme.id_theme)}
                        className={`${styles.btnAction} ${styles.btnDelete}`}
                      >
                        <span className={styles.text}>Supprimer</span>
                        <span className={styles.icon}>
                          <IoCloseCircle />
                        </span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredThemes.length > 0 && (
        <div className={styles.pagination}>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
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

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer ce thème ?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
