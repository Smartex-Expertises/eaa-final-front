import { forwardRef, useImperativeHandle } from "react";
import jsPDF from "jspdf";

export interface GeneratePDFRef {
  generatePdf: () => void;
}

interface GeneratePDFProps {
  seance: number;
  type: string;
  date: string | null;
  heure: string | null;
  objectifs_seance: string | null;
  taches_effectuees: string | null;
  taches_prochaine_seance: string | null;
  duree_seance: number | null;
  concern: string | null;
  observation: string | null;
}

const GeneratePDF = forwardRef<GeneratePDFRef, GeneratePDFProps>(
  (
    {
      seance,
      type,
      date,
      heure,
      objectifs_seance,
      taches_effectuees,
      taches_prochaine_seance,
      duree_seance,
      concern,
      observation,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      generatePdf() {
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
        doc.text("Détails de la Séance", margin, y);
        y += 15;
        
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 3;

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

        const titleHeight = 10;
        let titleY = y;

        columnTitles.forEach((title, index) => {
          const colX = margin + index * columnWidths[index];
          doc.text(title, colX + padding, titleY + padding);
          doc.setLineWidth(0.5);
          doc.rect(
            colX,
            titleY - padding,
            columnWidths[index],
            titleHeight + padding
          );
        });

        doc.setLineWidth(0.5);
        doc.line(
          margin,
          titleY + titleHeight,
          pageWidth - margin,
          titleY + titleHeight
        );
        titleY += titleHeight + 5;

        const data = [
          [
            `Séance: ${seance}`,
            `Type: ${type}`,
            `Date: ${date || "Pas encore éffectuée"}`,
            `Heure: ${heure || "Pas encore éffectuée"}`,
            `Durée: ${
              duree_seance ? `${duree_seance} minutes` : "Pas encore éffectuée"
            }`,
            "",
            "",
          ],
          [`${objectifs_seance || "Pas encore éffectuée"}`],
          [`${taches_effectuees || "Pas encore éffectuée"}`],
          [`${taches_prochaine_seance || "Pas encore éffectuée"}`],
          [`${concern || "Pas encore lu"}`],
          [`${observation || "Aucune observation"}`],
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

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
      },
    }));

    return null;
  }
);

export default GeneratePDF;
