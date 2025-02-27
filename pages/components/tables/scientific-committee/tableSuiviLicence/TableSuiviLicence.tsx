import React, { useRef, useState, useEffect } from "react";
import {
  IoArrowUndo,
  IoArrowRedoSharp,
  IoEye,
  IoCheckmarkDoneCircle,
} from "react-icons/io5";
import styles from "../../table.module.css";
import GeneratePdfRapports, {
  GeneratePdfRapportsRef,
} from "@/pages/components/pdf/GeneratePdfRapports";
import ConfirmValidateModal from "@/pages/components/modals/confirmValidateModal/ConfirmValidateModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllAvisModal from "@/pages/components/modals/allAvisModal/AllAvisModal";

interface Expert {
  id_expert: number;
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
  email: string;
  photo: string | null;
  en_ligne: number;
  id_compte: number;
  created_at: string;
  updated_at: string;
}

interface AvisExpert {
  id_avis: number;
  id_suivi: number;
  id_expert: number;
  avis: string;
  created_at: string;
  updated_at: string;
  expert: Expert;
}

interface Suivi {
  id_suivi: number;
  etudiant: {
    matricule: string;
    nom: string;
    prenom: string;
    classe: string;
  };
  enseignant1: {
    nom: string;
    prenom: string;
  };
  rapports: {
    seance: number;
    date: string | null;
    heure: string | null;
    objectifs_seance: string | null;
    taches_effectuees: string | null;
    taches_prochaine_seance: string | null;
    duree_seance: string | null;
    concern: string | null;
    observation: string | null;
  }[];
  fichiers_licence: {
    id_fichiers_licence: number;
    id_suivi: number;
    memoire_final: string;
    apd: string;
    validation_finale: number;
    created_at: string;
    updated_at: string;
  };
  avis_experts: AvisExpert[];
}

interface TableSuiviProps {
  suivis: Suivi[];
}

const TableSuivi: React.FC<TableSuiviProps> = ({ suivis = [] }) => {
  const pdfGeneratorRef = useRef<GeneratePdfRapportsRef>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedFichierId, setSelectedFichierId] = useState<number | null>(
    null
  );
  const [selectedClass, setSelectedClass] = useState<string>("");

  const handleGeneratePdf = (suivi: Suivi) => {
    if (pdfGeneratorRef.current) {
      pdfGeneratorRef.current.generatePdf(suivi);
    }
  };
  const apiUrl = process.env.NEXT_PUBLIC_URL;

  const handleValidateClick = (id_fichier_licence: number) => {
    setSelectedFichierId(id_fichier_licence);
    setShowModal(true);
  };

  const handleConfirmValidation = async () => {
    if (selectedFichierId !== null) {
      console.log(`Validation du fichier avec l'ID: ${selectedFichierId}`);
      try {
        const response = await fetch(
          "/api/scientific-committee/final-licence",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_fichier_licence: selectedFichierId }), // Assurez-vous d'envoyer l'objet correctement
          }
        );

        if (response.ok) {
          toast.success("Validation réussie !");
        } else {
          console.log("Erreur lors de la validation");
        }
      } catch (error) {
        console.error("Une erreur s'est produite:", error);
      } finally {
        setShowModal(false);
      }
    }
  };

  const handleCancelValidation = () => {
    setShowModal(false);
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [classesToDisplay, setClassesToDisplay] = useState<any[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/class/class", {
          method: "GET",
        });
        const data = await response.json();
        const LicenceClasse = data.data.filter(
          (classe: any) => classe.niveau === "Licence"
        );
        setClassesToDisplay(LicenceClasse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClasses();
  }, []);

  const filteredData = suivis.filter((suivi) => {
    const student = suivi.etudiant;
    const searchLower = searchQuery.toLowerCase();
    const classFilter = selectedClass
      ? student.classe.toLowerCase().includes(selectedClass.toLowerCase())
      : true;

    return (
      (student.nom.toLowerCase().includes(searchLower) ||
        student.prenom.toLowerCase().includes(searchLower) ||
        student.matricule.toLowerCase().includes(searchLower)) &&
      classFilter
    );
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

  const [showAvisModal, setShowAvisModal] = useState<boolean>(false);
  const [selectedAvis, setSelectedAvis] = useState<AvisExpert[] | null>(null);
  const handleOpenAvisModal = (avis: AvisExpert[]) => {
    setSelectedAvis(avis);
    setShowAvisModal(true);
  };

  const handleCloseAvisModal = () => {
    setShowAvisModal(false);
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="bottom-right" />

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
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className={styles.selectFilter}
          >
            <option value="">-- Filtrer par Classe --</option>
            {classesToDisplay && classesToDisplay.map((classe, index) => (
              <option key={index} value={classe.nom}>
                {classe.nom}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.styledTable}>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Etudiant</th>
              <th>Classe</th>
              <th>Directeur de mémoire</th>
              <th>Partie architecturale</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData && currentData.map((suivi) => (
              <tr key={suivi.id_suivi}>
                <td>{suivi.etudiant.matricule}</td>
                <td>
                  {suivi.etudiant.nom} {suivi.etudiant.prenom}
                </td>
                <td>{suivi.etudiant.classe}</td>
                <td>
                  {suivi.enseignant1.nom} {suivi.enseignant1.prenom}
                </td>
                <td>
                  {suivi.fichiers_licence?.memoire_final &&
                  suivi.fichiers_licence?.apd ? (
                    <>
                      <a
                        href={`${apiUrl}${suivi.fichiers_licence.memoire_final}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        Mémoire final
                      </a>
                      <a
                        href={`${apiUrl}${suivi.fichiers_licence.apd}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        APD
                      </a>
                    </>
                  ) : (
                    <div>En attente</div>
                  )}
                </td>
                <td>
                  <button
                    className={`${styles.btnAction} ${styles.btnVoir}`}
                    onClick={() => handleGeneratePdf(suivi)}
                  >
                    <span className={styles.text}>Rapports</span>
                    <span className={styles.icon}>
                      <IoEye />
                    </span>
                  </button>
                  <button
                    className={`${styles.btnAction} ${styles.btnVoir}`}
                    onClick={() => handleOpenAvisModal(suivi.avis_experts)}
                  >
                    <span className={styles.text}>Voir Avis</span>
                    <span className={styles.icon}>
                      <IoEye />
                    </span>
                  </button>
                  {suivi.fichiers_licence?.memoire_final &&
                    suivi.fichiers_licence?.apd &&
                    suivi.fichiers_licence.validation_finale !== 1 && (
                      <button
                        className={`${styles.btnAction} ${styles.btnValider}`}
                        onClick={() =>
                          handleValidateClick(
                            suivi.fichiers_licence.id_fichiers_licence
                          )
                        }
                      >
                        <span className={styles.text}>Valider</span>
                        <span className={styles.icon}>
                          <IoCheckmarkDoneCircle />
                        </span>
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IoArrowUndo />
          </button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IoArrowRedoSharp />
          </button>
        </div>
      )}

      <GeneratePdfRapports ref={pdfGeneratorRef} />

      {showModal && (
        <ConfirmValidateModal
          title="Validation mis parcours"
          message="Après vérification des documents, voulez-vous valider ce travail ?"
          onConfirm={handleConfirmValidation}
          onCancel={handleCancelValidation}
        />
      )}

      {showAvisModal && selectedAvis && (
        <AllAvisModal avis={selectedAvis} onClose={handleCloseAvisModal} />
      )}
    </div>
  );
};

export default TableSuivi;
