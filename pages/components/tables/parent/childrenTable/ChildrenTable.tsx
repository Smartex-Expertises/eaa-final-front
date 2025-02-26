import React, { useState, useRef } from "react";
import styles from "../../table.module.css";
import { IoEye, IoDocument, IoEyeOff } from "react-icons/io5";
import ThemeDisplay from "@/pages/components/modals/themeDisplay/ThemeDisplay";
import ModalEncadrants from "@/pages/components/modals/modalEncadrants/ModalEncadrants";
import TableProgression from "../../etudiant/tableProgression/TableProgression";
import GeneratePdfRapports, {
  GeneratePdfRapportsRef,
} from "@/pages/components/pdf/GeneratePdfRapports";

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
  validation_etudiant: number;
  validation_encadrant: number;
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

interface FichiersMaster {
  id_fichiers_master: number;
  id_suivi: number;
  memoire_analytique: string | null;
  dossier_esquisse: string | null;
  validation_mis_parcours: number;
  memoire_final: string | null;
  apd: string | null;
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

interface SuiviMemoire {
  id_suivi: number;
  type_suivi: string;
  id_etudiant: number;
  id_enseignant_1: number;
  id_enseignant_2: number;
  id_theme: string | null;
  rapport_actif: number;
  created_at: string;
  updated_at: string;
  enseignant1: Enseignant;
  enseignant2: Enseignant;
  rapports: Rapport[];
  theme: Theme;
  fichiers_master: FichiersMaster;
  fichiers_licence: FichiersLicence;
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
  suivis_memoire: SuiviMemoire[];
}

interface ChildrenTableProps {
  childrens: Etudiant[];
}

const ChildrenTable: React.FC<ChildrenTableProps> = ({ childrens }) => {
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

  const handleViewTheme = (suivisMemoire: SuiviMemoire[]) => {
    const theme = suivisMemoire[0]?.theme?.theme || null;
    setThemeToShow(theme);
    setIsModalOpen(true);
  };

  const handleViewEncadrants = (suivisMemoire: SuiviMemoire[]) => {
    const enseignant1 = suivisMemoire[0]?.enseignant1 || null;
    const enseignant2 = suivisMemoire[0]?.enseignant2 || null;
    setEncadrantsToShow({ enseignant1, enseignant2 });
    setIsEncadrantsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setThemeToShow(null);
  };

  const closeEncadrantsModal = () => {
    setIsEncadrantsModalOpen(false);
    setEncadrantsToShow(null);
  };

  const closeTableProgression = () => {
    setIsTableProgressionVisible(false);
    setProgressionData(null);
  };

  const pdfGeneratorRef = useRef<GeneratePdfRapportsRef>(null);

  const handleGeneratePdf = (suivi: SuiviMemoire) => {
    if (pdfGeneratorRef.current) {
      pdfGeneratorRef.current.generatePdf(); 
    }
  };

  // const handleGeneratePdf = (suiviMemoire: SuiviMemoire, matricule : any,nom : any,prenom : any) => {
  //   if (pdfGeneratorRef.current) {
  //     const suivi: Suivi = {
  //       ...suiviMemoire,
  //       etudiant: {
  //         matricule: matricule, // Remplace par les vraies valeurs si possible
  //         nom: nom,
  //         prenom: prenom,
  //       },
  //     };
  
  //     pdfGeneratorRef.current.generatePdf(suivi);
  //   }
  // };
  

  return (
    <div className={styles.container}>
      <div style={{ backgroundColor: "#fff", borderRadius: "5px" }}>
        {isTableProgressionVisible && progressionData && (
          <>
            <div className={styles.right}>
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
            {childrens.map((child, index) => (
              <tr
                key={child.id_etudiant}
                className={index % 2 === 1 ? styles.alternateRow : ""}
              >
                <td>{child.matricule}</td>
                <td>{child.nom}</td>
                <td>{child.prenom}</td>
                <td>{child.niveau}</td>
                <td>{child.classe}</td>
                <td>
                  <button
                    onClick={() => handleViewTheme(child.suivis_memoire)}
                    className={`${styles.btnAction} ${styles.btnVoir}`}
                  >
                    <span className={styles.text}>Thème</span>
                    <span className={styles.icon}>
                      <IoEye />
                    </span>
                  </button>
                  <button
                    onClick={() => handleViewEncadrants(child.suivis_memoire)}
                    className={`${styles.btnAction} ${styles.btnVoir}`}
                  >
                    <span className={styles.text}>Encadrants</span>
                    <span className={styles.icon}>
                      <IoEye />
                    </span>
                  </button>
                  <button
                    onClick={() => handleGeneratePdf(child.suivis_memoire[0])}
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
      <ThemeDisplay
        isOpen={isModalOpen}
        theme={themeToShow}
        onClose={closeModal}
      />
      {isEncadrantsModalOpen && encadrantsToShow && (
        <ModalEncadrants
          enseignant1={encadrantsToShow.enseignant1}
          enseignant2={encadrantsToShow.enseignant2}
          onClose={closeEncadrantsModal}
        />
      )}
    </div>
  );
};

export default ChildrenTable;
