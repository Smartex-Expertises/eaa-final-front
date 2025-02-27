import React, { useState } from "react";
import { IoArrowUndo, IoArrowRedoSharp, IoEye, IoBulb } from "react-icons/io5";
import ThemeDisplay from "@/pages/components/modals/themeDisplay/ThemeDisplay";
import ModalAddAvis from "@/pages/components/modals/modalAddAvis/ModalAddAvis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalAvisExpert from "@/pages/components/modals/modalAvisExpert/ModalAvisExpert";
import styles from "../../table.module.css";

// Définir les types des données
interface FichiersLicence {
  id_fichiers_licence: number;
  memoire_final: string | null;
  apd: string | null;
  validation_finale: number;
}

interface AvisExpert {
  id_avis: number;
  avis: string;
  created_at: string;
}

interface Suivi {
  id_suivi: number;
  type_suivi: string;
  rapport_actif: number;
  theme: { theme: string; status: number } | null;
  fichiers_licence: FichiersLicence;
  avis_experts: AvisExpert[];
}

interface Etudiant {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  classe: string;
  suivis_memoire: Suivi[];
}

interface TableSuiviExpertLicenceProps {
  data: Etudiant[];
}

const TableSuiviExpertLicence: React.FC<TableSuiviExpertLicenceProps> = ({
  data ,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModal, setActiveModal] = useState<
    "theme" | "avis" | "avisExpert" | null
  >(null);
  const [themeToShow, setThemeToShow] = useState<string | null>(null);
  const [selectedSuiviId, setSelectedSuiviId] = useState<number | null>(null);
  const [avisExpertsToShow, setAvisExpertsToShow] = useState<
    AvisExpert[] | null
  >(null);

  const filteredData = data ?  data.filter((etudiant) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      etudiant.nom.toLowerCase().includes(searchLower) ||
      etudiant.prenom.toLowerCase().includes(searchLower) ||
      etudiant.matricule.toLowerCase().includes(searchLower)
    );
  }) : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const apiUrl = process.env.NEXT_PUBLIC_URL;

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewTheme = (theme: string | null, suiviId: number) => {
    setThemeToShow(theme);
    setSelectedSuiviId(suiviId);
    setActiveModal("theme");
  };

  const handleOpenAvisModal = (suiviId: number) => {
    setSelectedSuiviId(suiviId);
    setActiveModal("avis");
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedSuiviId(null);
    setThemeToShow(null);
  };

  const handleViewAvisExperts = (avisExpert: AvisExpert[]) => {
    setAvisExpertsToShow(avisExpert);
    setActiveModal("avisExpert");
  };

  const handleSubmitAvis = async (idSuivi: number, avis: string) => {
    handleCloseModal();
    try {
      const response = await fetch("/api/expert/avis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idSuivi, avis }),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || "Avis envoyé avec succès !");
      } else {
        const responseData = await response.json();
        toast.error(
          responseData.message || "Erreur lors de l'envoi de l'avis."
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de l'avis");
      console.error(error);
    } finally {
      window.location.reload();
    }
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
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.styledTable}>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Classe</th>
              <th>Type de suivi</th>
              <th>Thème</th>
              <th>Partie architectural</th>
              <th>Avis</th>
            </tr>
          </thead>
          <tbody>
            {currentData  && currentData.map((etudiant) => (
              <tr key={etudiant.matricule}>
                <td>{etudiant.matricule}</td>
                <td>
                  {etudiant.nom} {etudiant.prenom}
                </td>
                <td>{etudiant.classe}</td>
                <td>
                  {etudiant && etudiant.suivis_memoire && etudiant.suivis_memoire.map((suivi) => (
                    <div key={suivi.id_suivi}>
                      <p>{suivi.type_suivi}</p>
                    </div>
                  ))}
                </td>
                <td>
                  {etudiant && etudiant.suivis_memoire && etudiant.suivis_memoire.map((suivi) => (
                    <button
                      key={suivi.id_suivi}
                      onClick={() =>
                        suivi.theme &&
                        handleViewTheme(suivi.theme.theme, suivi.id_suivi)
                      }
                      className={`${styles.btnAction} ${styles.btnVoir}`}
                    >
                      <span className={styles.text}>Voir</span>
                      <span className={styles.icon}>
                        <IoEye />
                      </span>
                    </button>
                  ))}
                </td>
                <td>
                  {etudiant && etudiant.suivis_memoire && etudiant.suivis_memoire.map((suivi) => (
                    <div key={suivi.id_suivi}>
                      {suivi.fichiers_licence.memoire_final &&
                      suivi.fichiers_licence.apd ? (
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
                    </div>
                  ))}
                </td>
                <td>
                  {etudiant && etudiant.suivis_memoire && etudiant.suivis_memoire.map((suivi) => (
                    <div>
                      {suivi.fichiers_licence?.memoire_final ||
                      suivi.fichiers_licence?.apd ? (
                        <>
                          <button
                            key={suivi.id_suivi}
                            onClick={() => handleOpenAvisModal(suivi.id_suivi)}
                            className={`${styles.btnAction} ${styles.btnVoir}`}
                          >
                            <span className={styles.text}>Émettre</span>
                            <span className={styles.icon}>
                              <IoBulb />
                            </span>
                          </button>
                          <button
                            key={suivi.id_suivi}
                            onClick={() =>
                              handleViewAvisExperts(suivi.avis_experts)
                            }
                            className={`${styles.btnAction} ${styles.btnVoir}`}
                          >
                            <span className={styles.text}>Voir</span>
                            <span className={styles.icon}>
                              <IoEye />
                            </span>
                          </button>
                        </>
                      ) : (
                        <div>En attente</div>
                      )}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData && filteredData.length > 0 && (
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

      {activeModal === "theme" && (
        <ThemeDisplay
          isOpen={true}
          theme={themeToShow}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === "avis" && (
        <ModalAddAvis
          isOpen={true}
          onClose={handleCloseModal}
          onSubmitAvis={handleSubmitAvis}
          suiviId={selectedSuiviId}
        />
      )}

      {activeModal === "avisExpert" && avisExpertsToShow && (
        <ModalAvisExpert
          isOpen={true}
          onClose={handleCloseModal}
          avisExperts={avisExpertsToShow}
        />
      )}
    </div>
  );
};

export default TableSuiviExpertLicence;
