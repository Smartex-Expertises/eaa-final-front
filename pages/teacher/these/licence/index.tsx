// pages/TheseLicence.tsx
import React, { useEffect, useState } from "react";
import LayoutTeacher from "@/layouts/teacher/LayoutTeacher";
import TableSuiviLicence from "@/pages/components/tables/enseignant/tableSuiviLicence/TableSuiviLicence";

// Définition des interfaces pour le typage des données
interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  niveau: string;
  classe: string;
  telephone: string;
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

interface Suivi {
  id_suivi: number;
  type_suivi: string;
  id_etudiant: number;
  id_enseignant_1: number;
  id_enseignant_2: number | null;
  id_theme: number | null;
  rapport_actif: number;
  created_at: string;
  updated_at: string;
  etudiant: Etudiant;
  enseignant1: Enseignant;
  theme: string | null;
}

interface ResponseData {
  theme: string | null;
  suivi: Suivi;
}

export default function TheseLicence() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suivis, setSuivis] = useState<Suivi[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/teacher/suiviLicence", {
          method: "GET",
        });
        const result: ResponseData[] = await response.json();
        console.log(result);
        // Aplatir les suivis avec le thème
        const suivisList = result.flatMap((data) => ({
          ...data.suivi,
          theme: data.theme,
        }));
        setSuivis(suivisList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div style={{ textAlign: "center" }}>Chargement...</div>;
  }

  return (
    <div>
      {suivis.length === 0 ? (
        <p>Aucun suivi pour l'instant</p>
      ) : (
        <TableSuiviLicence suivis={suivis} />
      )}
    </div>
  );
}

TheseLicence.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutTeacher>{page}</LayoutTeacher>;
};
