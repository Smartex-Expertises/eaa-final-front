import React, { useState, useRef, useEffect } from "react";
import styles from "../table.module.css";
import {
  IoEye,
  IoDocument,
  IoEyeOff,
  IoArrowUndo,
  IoArrowRedoSharp,
} from "react-icons/io5";
import ThemeDisplay from "@/pages/components/modals/themeDisplay/ThemeDisplay";
import ModalEncadrants from "@/pages/components/modals/modalEncadrants/ModalEncadrants";
import TableProgression from "../etudiant/tableProgression/TableProgression";
import GeneratePdfRapports, {
  GeneratePdfRapportsRef,
} from "@/pages/components/pdf/GeneratePdfRapports";

interface Rapport {
  id_rapport: number;
  id_suivi: number;
  id_auteur: number;
  seance: number;
  date: string | null;
  heure: string | null;
  objectifs_seance: string | null;
  taches_effectuees: string | null;
  duree_seance: string | null;
  taches_prochaine_seance: string | null;
  observation: string | null;
  validation_etudiant: number;
  concern: string | null;
  validation_encadrant: number;
  created_at: string;
  updated_at: string;
}

interface FichiersMaster {
  id_fichiers_master: number;
  id_suivi: number;
  memoire_analytique: string;
  dossier_esquisse: string;
  validation_mis_parcours: number;
  memoire_final: string;
  apd: string;
  validation_finale: number;
  created_at: string;
  updated_at: string;
}

interface FichiersLicence {
  id_fichiers_licence: number;
  id_suivi: number;
  memoire_final: string;
  apd: string;
  validation_finale: number;
  created_at: string;
  updated_at: string;
}

interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  niveau: string;
  classe: string;
  photo: string | null;
  en_ligne: number;
  id_parent: number;
  id_compte: number;
  created_at: string;
  updated_at: string;
}

interface Enseignant {
  id_enseignant: number;
  matricule: string;
  nom: string;
  prenom: string;
  type: string;
  specialite: string;
  grade: string;
  telephone: string;
  email: string;
  photo: string | null;
  en_ligne: number;
  id_compte: number;
  created_at: string;
  updated_at: string;
}

interface Theme {
  id_theme: number;
  theme: string;
  status: number;
  id_etudiant: number;
  created_at: string;
  updated_at: string;
}

interface Suivi {
  id_suivi: number;
  type_suivi: string;
  id_etudiant: number;
  id_enseignant_1: number;
  id_enseignant_2: number;
  id_theme: number | null;
  rapport_actif: number;
  created_at: string;
  updated_at: string;
  rapports: Rapport[];
  fichiers_master: FichiersMaster | null;
  fichiers_licence: FichiersLicence | null;
  etudiant: Etudiant;
  enseignant1: Enseignant;
  enseignant2: Enseignant;
  theme: Theme;
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
}

interface AllSuivisProps {
  suivis: Suivi[];
}

const AllSuivis: React.FC<AllSuivisProps> = ({ suivis }) => {
  const [themeToShow, setThemeToShow] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [encadrantsToShow, setEncadrantsToShow] = useState<{
    enseignant1: Enseignant | null;
    enseignant2: Enseignant | null;
  } | null>(null);
  const [isEncadrantsModalOpen, setIsEncadrantsModalOpen] =
    useState<boolean>(false);
  const [isTableProgressionVisible, setIsTableProgressionVisible] =
    useState<boolean>(false);
  const [progressionData, setProgressionData] = useState<{
    fichierMaster: any;
    fichierLicence: any;
    typeSuivi: string;
    rapports: any[];
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
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
  const handleViewTheme = (suivi: Suivi) => {
    const theme = suivi.theme?.theme || null;
    setThemeToShow(theme);
    setIsModalOpen(true);
  };

  const handleViewEncadrants = (suivi: Suivi) => {
    const enseignant1 = suivi.enseignant1 || null;
    const enseignant2 = suivi.enseignant2 || null;
    setEncadrantsToShow({ enseignant1, enseignant2 });
    setIsEncadrantsModalOpen(true);
  };

  const pdfGeneratorRef = useRef<GeneratePdfRapportsRef>(null);

  const handleGeneratePdf = (suivi: Suivi) => {
    if (pdfGeneratorRef.current) {
      pdfGeneratorRef.current.generatePdf(suivi);
    }
  };

  const closeTableProgression = () => {
    setIsTableProgressionVisible(false);
    setProgressionData(null);
  };

  const itemsPerPage = 10;

  const filteredData = suivis.filter((suivi) => {
    const student = suivi.etudiant;
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
        student.nom.toLowerCase().includes(searchLower) ||
        student.prenom.toLowerCase().includes(searchLower)
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

  const classesToDisplay = selectedLevel
    ? classesByNiveau[selectedLevel]
    : Object.values(classesByNiveau).flat();

  return (
    <div>
      <div className={styles.container}>
        <div style={{ backgroundColor: "#fff", borderRadius: "5px" }}>
          {isTableProgressionVisible && progressionData && (
            <>
              <div className={styles.right}>
                <div></div>
                <button
                  className={styles.btnHide}
                  onClick={closeTableProgression}
                >
                  <IoEyeOff />
                </button>
              </div>

              <TableProgression
                fichierMaster={progressionData.fichierMaster}
                fichierLicence={progressionData.fichierLicence}
                typeSuivi={progressionData.typeSuivi}
                rapports={progressionData.rapports}
              />
            </>
          )}
        </div>
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
                setSelectedClass(""); // Reset selected class when level changes
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
          <table className={styles.styledTable}>
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Niveau</th>
                <th>Classe</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((suivi, index) => (
                <tr
                  key={suivi.id_suivi}
                  className={index % 2 === 1 ? styles.alternateRow : ""}
                >
                  <td>{suivi.etudiant.matricule}</td>
                  <td>{suivi.etudiant.nom}</td>
                  <td>{suivi.etudiant.prenom}</td>
                  <td>{suivi.etudiant.niveau}</td>
                  <td>{suivi.etudiant.classe}</td>
                  <td>
                    <button
                      onClick={() => handleViewTheme(suivi)}
                      className={`${styles.btnAction} ${styles.btnVoir}`}
                    >
                      <span className={styles.text}>Thème</span>
                      <span className={styles.icon}>
                        <IoEye />
                      </span>
                    </button>
                    <button
                      onClick={() => handleViewEncadrants(suivi)}
                      className={`${styles.btnAction} ${styles.btnVoir}`}
                    >
                      <span className={styles.text}>Encadrants</span>
                      <span className={styles.icon}>
                        <IoEye />
                      </span>
                    </button>
                    <button
                      onClick={() => handleGeneratePdf(suivi)}
                      className={`${styles.btnAction} ${styles.btnVoir}`}
                    >
                      <span className={styles.text}>Rapports</span>
                      <span className={styles.icon}>
                        <IoDocument />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

        <GeneratePdfRapports ref={pdfGeneratorRef} />

        <ThemeDisplay
          isOpen={isModalOpen}
          theme={themeToShow}
          onClose={() => setIsModalOpen(false)}
        />

        {isEncadrantsModalOpen && encadrantsToShow && (
          <ModalEncadrants
            enseignant1={encadrantsToShow.enseignant1}
            enseignant2={encadrantsToShow.enseignant2}
            onClose={() => setIsEncadrantsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AllSuivis;
