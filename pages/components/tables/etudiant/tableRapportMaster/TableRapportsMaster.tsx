import React, { useState, useRef, useEffect } from "react";
import { IoEye, IoCheckmarkDoneCircle } from "react-icons/io5";
import ConfirmValidateModalStudent from "@/pages/components/modals/confirmValidateModalStudent/ConfirmValidateModalStudent";
import styles from "../../table.module.css";
import GeneratePDF, {
  GeneratePDFRef,
} from "@/pages/components/pdf/GeneratePDF";

interface Rapport {
  id_rapport: number;
  id_auteur: number | null;
  seance: number;
  type: string;
  date: string | null;
  heure: string | null;
  objectifs_seance: string | null;
  taches_effectuees: string | null;
  duree_seance: number | null;
  taches_prochaine_seance: string | null;
  observation: string | null;
  validation_etudiant: number;
  concern: string | null;
  validation_encadrant: number;
  updated_at: string;
}

interface TableauRapportsMasterProps {
  rapports: Rapport[];
}

export default function TableRapportsMaster({
  rapports,
}: TableauRapportsMasterProps) {
  const [currentRapportId, setCurrentRapportId] = useState<number | null>(null);
  const pdfGeneratorRef = useRef<GeneratePDFRef>(null);
  const [rapportToGeneratePdf, setRapportToGeneratePdf] =
    useState<Rapport | null>(null);

  const openModal = (id: number) => {
    setCurrentRapportId(id);
  };

  const closeModal = () => {
    setCurrentRapportId(null);
  };

  const headers = [
    "Séance",
    "Date de la séance",
    "Heure de la séance",
    "Status",
    "Rapport",
  ];

  const handleGeneratePdf = (rapport: Rapport) => {
    setRapportToGeneratePdf(rapport);
  };

  useEffect(() => {
    if (rapportToGeneratePdf && pdfGeneratorRef.current) {
      pdfGeneratorRef.current.generatePdf();
    }
  }, [rapportToGeneratePdf]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.tableWrapper}>
          {rapports.length === 0 ? (
            <p className={styles.noData}>Aucun rapport</p>
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
                {rapports.map((rapport, index) => {
                  let validationStatus = "";

                  if (rapport.id_auteur === null) {
                    validationStatus = "Pas encore effectuée";
                  } else if (rapport.validation_etudiant === 0) {
                    validationStatus = "En attente de lecture";
                  } else if (rapport.validation_etudiant === 1) {
                    validationStatus = "Validé";
                  }

                  // const isPreviousReportDone =
                  //   index === 0 ||
                  //   rapports[index - 1]?.validation_etudiant === 1;
                  return (
                    <tr
                      key={rapport.id_rapport}
                      className={index % 2 === 1 ? styles.alternateRow : ""}
                    >
                      <td>Séance {rapport.seance}</td>
                      <td>{rapport.date || "Pas encore éffectuée"}</td>
                      <td>
                        {rapport.heure
                          ? `${rapport.heure}`
                          : "Pas encore éffectuée"}
                      </td>
                      <td
                        className={
                          validationStatus === "Validé"
                            ? styles.statusValidated
                            : styles.statusPending
                        }
                      >
                        {validationStatus}
                      </td>
                      <td>
                        {rapport.id_auteur === null ? (
                          <span>Pas encore effectuée</span>
                        ) : (
                          <>
                            <button
                              className={`${styles.btnAction} ${styles.btnVoir}`}
                              onClick={() => handleGeneratePdf(rapport)}
                            >
                              <span className={styles.text}>Voir</span>
                              <span className={styles.icon}>
                                <IoEye />
                              </span>
                            </button>
                            {rapport.validation_etudiant === 0 && (
                              <button
                                className={`${styles.btnAction} ${styles.btnValider}`}
                                onClick={() => openModal(rapport.id_rapport)}
                              >
                                <span className={styles.text}>Lu</span>
                                <span className={styles.icon}>
                                  <IoCheckmarkDoneCircle />
                                </span>
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {currentRapportId !== null && (
          <ConfirmValidateModalStudent
            RapportId={currentRapportId}
            onCancel={closeModal}
          />
        )}
      </div>

      {/* Ne rendre GeneratePDF qu'une seule fois */}
      {rapportToGeneratePdf && (
        <GeneratePDF
          ref={pdfGeneratorRef}
          seance={rapportToGeneratePdf.seance}
          type={rapportToGeneratePdf.type}
          date={rapportToGeneratePdf.date}
          heure={rapportToGeneratePdf.heure}
          objectifs_seance={rapportToGeneratePdf.objectifs_seance}
          taches_effectuees={rapportToGeneratePdf.taches_effectuees}
          taches_prochaine_seance={rapportToGeneratePdf.taches_prochaine_seance}
          observation={rapportToGeneratePdf.observation}
          duree_seance={rapportToGeneratePdf.duree_seance}
          concern={rapportToGeneratePdf.concern}
        />
      )}
    </>
  );
}
