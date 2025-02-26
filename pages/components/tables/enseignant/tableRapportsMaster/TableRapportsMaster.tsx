import React, { useState, useRef, useEffect } from "react";
import { IoEye, IoCheckmarkDoneCircle } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../table.module.css";
import GeneratePDF, {
  GeneratePDFRef,
} from "@/pages/components/pdf/GeneratePDF";
import ConfirmValidateModal from "@/pages/components/modals/confirmValidateModal/ConfirmValidateModal";

interface Rapport {
  id_rapport: number;
  id_suivi: number;
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
  idEncadrant: number | null;
}

export default function TableRapportsMaster({
  rapports,
  idEncadrant,
}: TableauRapportsMasterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRapportId, setCurrentRapportId] = useState<number | null>(null);
  const [rapportToGeneratePdf, setRapportToGeneratePdf] =
    useState<Rapport | null>(null);
  const pdfGeneratorRef = useRef<GeneratePDFRef>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRapportId(null);
  };

  const openModalConfirm = (id: number) => {
    setCurrentRapportId(id);
  };

  const closeModalConfirm = () => {
    setCurrentRapportId(null);
  };

  const handleValidateRapport = async (id: number) => {
    try {
      const response = await fetch("/api/teacher/validateRapport", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const responseData = await response.json();
        toast.error(
          responseData.message || "Erreur lors de la validation du rapport."
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la validation du rapport.");
    } finally {
      closeModal();
    }
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
      <ToastContainer position="bottom-right" />
      <div className={styles.container}>
        <div className={styles.tableWrapper}>
          {rapports && rapports.length === 0 ? (
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
                {rapports && rapports.map((rapport, index) => {
                  const isPreviousReportDone =
                    index === 0 ||
                    rapports[index - 1]?.validation_etudiant === 1;

                  const validationStatus = (() => {
                    if (
                      rapport.id_auteur === null &&
                      rapport.validation_etudiant !== 1
                    ) {
                      return "Pas encore effectuée";
                    }
                    if (rapport.validation_etudiant !== 1) {
                      return "En attente de lecture";
                    } else if (rapport.validation_etudiant === 1) {
                      return "Validé";
                    }
                  })();

                  return (
                    <tr
                      key={rapport.id_rapport}
                      className={index % 2 === 1 ? styles.alternateRow : ""}
                    >
                      <td>Séance {rapport.seance}</td>
                      <td>{rapport.date || "Pas encore effectuée"}</td>
                      <td>
                        {rapport.heure
                          ? `${rapport.heure}`
                          : "Pas encore effectuée"}
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
                        {rapport.id_auteur !== null ? (
                          <button
                            className={`${styles.btnAction} ${styles.btnVoir}`}
                            onClick={() => handleGeneratePdf(rapport)}
                          >
                            <span className={styles.text}>Voir</span>
                            <span className={styles.icon}>
                              <IoEye />
                            </span>
                          </button>
                        ) : null}
                        {rapport.id_auteur !== idEncadrant &&
                          rapport.validation_encadrant === 0 && (
                            <button
                              className={`${styles.btnAction} ${styles.btnValider} `}
                              onClick={() =>
                                openModalConfirm(rapport.id_rapport)
                              }
                            >
                              <span className={styles.text}>Lu</span>
                              <span className={styles.icon}>
                                <IoCheckmarkDoneCircle />
                              </span>
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {currentRapportId !== null && !isModalOpen && (
          <ConfirmValidateModal
            title="Confirmation de lecture"
            message="En cliquant sur ce bouton, vous confirmez avoir lu ce rapport"
            onConfirm={() => handleValidateRapport(currentRapportId)}
            onCancel={closeModalConfirm}
          />
        )}

        {rapportToGeneratePdf && (
          <GeneratePDF
            ref={pdfGeneratorRef}
            seance={rapportToGeneratePdf.seance}
            type={rapportToGeneratePdf.type}
            date={rapportToGeneratePdf.date}
            heure={rapportToGeneratePdf.heure}
            objectifs_seance={rapportToGeneratePdf.objectifs_seance}
            taches_effectuees={rapportToGeneratePdf.taches_effectuees}
            taches_prochaine_seance={
              rapportToGeneratePdf.taches_prochaine_seance
            }
            observation={rapportToGeneratePdf.observation}
            duree_seance={rapportToGeneratePdf.duree_seance}
            concern={rapportToGeneratePdf.concern}
          />
        )}
      </div>
    </>
  );
}
