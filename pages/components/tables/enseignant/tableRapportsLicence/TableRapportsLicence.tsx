import React, { useState, useRef, useEffect } from "react";
import { IoEye, IoDocumentAttach } from "react-icons/io5";
import styles from "../../table.module.css";
import GeneratePDF, {
  GeneratePDFRef,
} from "@/pages/components/pdf/GeneratePDF";

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
  updated_at: string;
}

interface TableauRapportsProps {
  rapports: Rapport[];
}

export default function TableRapportsLicence({
  rapports,
}: TableauRapportsProps) {
  const [rapportToGeneratePdf, setRapportToGeneratePdf] =
    useState<Rapport | null>(null);
  const pdfGeneratorRef = useRef<GeneratePDFRef>(null);

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
                console.log(rapport.id_auteur);

                const validationStatus =
                  rapport.id_auteur === null
                    ? "Pas encore effectuée"
                    : rapport.validation_etudiant !== 1
                    ? "En attente de lecture"
                    : "Validé";

                return (
                  <tr
                    key={rapport.id_rapport}
                    className={index % 2 === 1 ? styles.alternateRow : ""}
                  >
                    <td>Séance {rapport.seance}</td>
                    <td>{rapport.date || "Pas encore effectuée"}</td>
                    <td>
                      {rapport.duree_seance
                        ? `${rapport.duree_seance} minutes`
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
                      <button
                        className={`${styles.btnAction} ${styles.btnVoir}`}
                        onClick={() => handleGeneratePdf(rapport)}
                      >
                        <span className={styles.text}>Voir</span>
                        <span className={styles.icon}>
                          <IoEye />
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

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
    </div>
  );
}
