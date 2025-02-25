import React, { useState } from "react";
import ConfirmModal from "../../../modals/confirmModal/ConfirmModal";
import styles from "../../table.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowUndo, IoArrowRedoSharp, IoCloseCircle } from "react-icons/io5";

interface TableProps {
  data: { id: number; nom: string; niveau: string }[];
  setData: React.Dispatch<
    React.SetStateAction<{ id: number; nom: string; niveau: string }[]>
  >;
}

export default function TableClasses({ data, setData }: TableProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<number | null>(null);

  const headers = ["Nom classe", "Niveau", "Actions"];
  const itemsPerPage = 5;

  const filteredData = Array.isArray(data)
    ? data.filter((row) => {
        if (selectedLevel && row.niveau !== selectedLevel) {
          return false;
        }
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          return (
            row.nom.toLowerCase().includes(searchLower) ||
            row.niveau.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
    : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteClass = (classId: number) => {
    setClassToDelete(classId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (classToDelete !== null) {
      try {
        const response = await fetch("/api/class/class", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: classToDelete }),
        });

        const responseData = await response.json();

        if (response.ok) {
          toast.success(
            responseData.message || "Classe supprimée avec succès!"
          );
          setData((prevData) =>
            prevData.filter((item) => item.id !== classToDelete)
          );
        } else {
          toast.error(
            responseData.message || "Erreur lors de la suppression de la classe"
          );
        }
      } catch (error) {
        toast.error("Erreur de réseau. Impossible de supprimer la classe.");
      } finally {
        setIsModalOpen(false);
        setClassToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setClassToDelete(null);
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
        <div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="">-- Filtrer par Niveau --</option>
            <option value="Licence">Licence</option>
            <option value="Master">Master</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {filteredData.length === 0 ? (
          <p className={styles.noData}>Aucune classe</p>
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
              {currentData.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 1 ? styles.alternateRow : ""}
                >
                  <td>{row.nom}</td>
                  <td>{row.niveau}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteClass(row.id)}
                      className={`${styles.btnAction} ${styles.btnDelete}`}
                    >
                      <span className={styles.text}>Supprimer</span>
                      <span className={styles.icon}>
                        <IoCloseCircle />
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

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cette classe ?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
