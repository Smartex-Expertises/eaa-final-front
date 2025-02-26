import React, { useState } from "react";
import { IoArrowUndo, IoArrowRedoSharp } from "react-icons/io5";
import styles from "../../table.module.css";

interface TableProps {
  data: (string | number)[][];
}

export default function TableTeachers({ data }: TableProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const headers = [
    "Matricule",
    "Nom",
    "Prénom",
    "Type",
    "Spécialité",
    "Grade",
    "Téléphone",
    "Email",
  ];

  const itemsPerPage = 10;

  const filteredData = data ? data.filter((row) => {
    const [matricule, nom, prenom, type, specialite, grade, telephone, email] =
      row;

    if (
      selectedType &&
      String(type).toLowerCase() !== selectedType.toLowerCase()
    ) {
      return false;
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        String(matricule).toLowerCase().includes(searchLower) ||
        String(nom).toLowerCase().includes(searchLower) ||
        String(prenom).toLowerCase().includes(searchLower) ||
        String(type).toLowerCase().includes(searchLower) ||
        String(specialite).toLowerCase().includes(searchLower) ||
        String(grade).toLowerCase().includes(searchLower) ||
        String(telephone).toLowerCase().includes(searchLower) ||
        String(email).toLowerCase().includes(searchLower)
      );
    }
    return true;
  }) : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        {/* Barre de recherche */}
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
        {filteredData.length === 0 ? (
          <p className={styles.noData}>Aucun enseignant trouvé</p>
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
                  key={index}
                  className={index % 2 === 1 ? styles.alternateRow : ""}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
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
    </div>
  );
}
