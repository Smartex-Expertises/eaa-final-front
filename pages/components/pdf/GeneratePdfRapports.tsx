import { forwardRef, useImperativeHandle } from "react";
import jsPDF from "jspdf";

interface Rapport {
  seance: number;
  date: string | null;
  heure: string | null;
  objectifs_seance: string | null;
  taches_effectuees: string | null;
  taches_prochaine_seance: string | null;
  duree_seance: string | null;
  concern: string | null;
  observation: string | null;
}

interface Suivi {
  id_suivi: number;
  etudiant: {
    matricule: string;
    nom: string;
    prenom: string;
  };
  enseignant1: {
    nom: string;
    prenom: string;
  };
  rapports: Rapport[];
}

export interface GeneratePdfRapportsRef {
  generatePdf: (suivi: Suivi) => void;
}

const GeneratePdfRapports = forwardRef<GeneratePdfRapportsRef, {}>((_, ref) => {
  useImperativeHandle(ref, () => ({
    generatePdf(suivi: Suivi) {
      const doc = new jsPDF("landscape");
      const margin = 5;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = 180;

      const columnWidths = [
        (pageWidth - 2 * margin) / 6,
        (pageWidth - 2 * margin) / 6,
        (pageWidth - 2 * margin) / 6,
        (pageWidth - 2 * margin) / 6,
        (pageWidth - 2 * margin) / 6,
        (pageWidth - 2 * margin) / 6,
      ];

      const padding = 3;
      let y = 20;

      doc.setFont("helvetica", "bold");
      doc.text(
        `Rapports de suivi pour ${suivi.etudiant.nom} ${suivi.etudiant.prenom}`,
        margin,
        y
      );
      y += 15;

      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 3;

      suivi.rapports.forEach((rapport, idx) => {
        if (idx > 0) {
          doc.addPage();
          y = 20;
        }

        const columnTitles = [
          "Séance",
          "Objectifs",
          "Tâches effectuées",
          "Tâches prochaine séance",
          "Préoccupations Étudiant",
          "Observations",
        ];

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        let titleY = y;

        columnTitles.forEach((title, index) => {
          const colX = margin + index * columnWidths[index];
          doc.text(title, colX + padding, titleY + padding);
          doc.setLineWidth(0.5);
          doc.rect(colX, titleY - padding, columnWidths[index], 10 + padding);
        });

        doc.setLineWidth(0.5);
        doc.line(margin, titleY + 10, pageWidth - margin, titleY + 10);
        titleY += 10 + 5;

        const data = [
          [
            `Séance: ${rapport.seance}`,
            `Date: ${rapport.date || "Pas encore éffectuée"}`,
            `Heure: ${rapport.heure || "Pas encore éffectuée"}`,
            `Durée: ${
              rapport.duree_seance
                ? `${rapport.duree_seance} min`
                : "Pas encore éffectuée"
            }`,
            "",
            "",
          ],
          [`${rapport.objectifs_seance || "Pas encore éffectuée"}`],
          [`${rapport.taches_effectuees || "Pas encore éffectuée"}`],
          [`${rapport.taches_prochaine_seance || "Pas encore éffectuée"}`],
          [`${rapport.concern || "Pas encore lu"}`],
          [`${rapport.observation || "Aucune observation"}`],
        ];

        let yContent = titleY;
        for (let i = 0; i < 6; i++) {
          const colX = margin + i * columnWidths[i];
          doc.setLineWidth(0.5);
          doc.rect(
            colX,
            yContent - 5,
            columnWidths[i],
            pageHeight - yContent + 10
          );

          let colY = yContent;
          data[i].forEach((text, idx) => {
            doc.setFont("helvetica", "normal");
            const textOptions = {
              maxWidth: columnWidths[i] - 2 * padding,
              align: "left" as "left" | "center" | "right" | "justify",
            };
            doc.text(text, colX + padding, colY + padding, textOptions);
            colY += 10;
          });
        }

        yContent += 20;
      });

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    },
  }));

  return null;
});

export default GeneratePdfRapports;
