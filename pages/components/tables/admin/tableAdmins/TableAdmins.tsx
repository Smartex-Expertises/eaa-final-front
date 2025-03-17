import React, { useState, useEffect } from "react";
import { IoArrowUndo, IoArrowRedoSharp, IoEye, IoPencilSharp } from "react-icons/io5";
import styles from "../../table.module.css";
import ModalDisplayParent from "../../../modals/modalDisplayParent/ModalDisplayParent";
import ModalEditStudent from "@/pages/components/modals/modalEditStudent/ModalEditStudent";

interface Parent {
  id_parent: number;
  nom_complet_parent: string;
  email_parent: string ;
  telephone_parent: string;
}

interface Student {
  id_etudiant: number;
  matricule: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  niveau: string;
  classe: string;
  parent: Parent;
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
}
interface Admin{
    id:string,
    email:string,
    type:string
}

interface TableProps {
  data: Admin[];
}

const TableAdmins = ({ data }: TableProps) => {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);
  const [classesByNiveau, setClassesByNiveau] = useState<{
    [key: string]: Classe[];
  }>({
    Licence: [],
    Master: [],
  });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/class/class", {
//           method: "GET",
//         });
//         const data = await response.json();
//         const classesByLevel = {
//           Licence: data.data.filter(
//             (classe: any) => classe.niveau === "Licence"
//           ),
//           Master: data.data.filter((classe: any) => classe.niveau === "Master"),
//         };
//         setClassesByNiveau(classesByLevel);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

  const headers = [
    "Email",
    "Type",
  ];

  const itemsPerPage = 10;

//   const filteredData = data ? data.filter((student) => {
//     if (selectedLevel && student.niveau !== selectedLevel) {
//       return false;
//     }
//     if (selectedClass && student.classe !== selectedClass) {
//       return false;
//     }
//     if (searchQuery) {
//       const searchLower = searchQuery.toLowerCase();
//       return (
//         student.matricule.toLowerCase().includes(searchLower) ||
//         student.nom.toLowerCase().includes(searchLower) ||
//         student.prenom.toLowerCase().includes(searchLower)
//       );
//     }
//     return true;
//   }) : [] ;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = (parent: Parent) => {
    setSelectedParent(parent);
    setIsModalOpen(true);
  };
  const openModalEdit = (student:Student) => {
    setSelectedStudent(student);
    setIsModalEditOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParent(null);
  };
  const closeModalEdit = () => {
    setIsModalEditOpen(false);
    setSelectedStudent(null);
  };
  
  


  const classesToDisplay = selectedLevel
    ? classesByNiveau[selectedLevel]
    : Object.values(classesByNiveau).flat();

  return (
    <>
      <div className={styles.container}>
        {/* <div className={styles.filterContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Recherche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
        </div> */}

        <div className={styles.tableWrapper}>
          {data && data.length === 0 ? (
            <p className={styles.noData}>Aucun  admin</p>
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
                {currentData && currentData.map((student, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 1 ? styles.alternateRow : ""}
                  >
                    <td>{student.email}</td>
                    <td>{student.type}</td>
                  
                    
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && data.length > 0 && (
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

        <ModalDisplayParent
          isOpen={isModalOpen}
          onClose={closeModal}
          parent={selectedParent}
        />
        <ModalEditStudent
          isOpen={isModalEditOpen}
          onClose={closeModalEdit}
          etudiant={selectedStudent}
        />
      </div>
    </>
  );
};

export default TableAdmins;
