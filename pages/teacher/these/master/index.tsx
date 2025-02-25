import React, { useEffect, useState } from "react";
import LayoutTeacher from "@/layouts/teacher/LayoutTeacher";
import TableSuiviMaster from "@/pages/components/tables/enseignant/tableSuiviMaster/TableSuiviMaster";

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

// Correction de l'interface Suivi
interface Suivi {
  id_suivi: number;
  theme: string | null;
  etudiant: Etudiant;
  enseignant1: Enseignant;
  enseignant2: Enseignant;
}

// Correction de l'interface ApiResponse
interface ApiResponse {
  suivi: Suivi;
  theme: string | null;
}

export default function TheseMaster() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suivis, setSuivis] = useState<Suivi[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/teacher/suiviMaster", {
          method: "GET",
        });
        const result: ApiResponse[] = await response.json();

        // Remapping des données pour créer la liste des suivis
        const suivisList: Suivi[] = result.map((data) => ({
          ...data.suivi,
          theme: data.theme,
        }));

        console.log(suivisList);
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
        <TableSuiviMaster suivis={suivis} />
      )}
    </div>
  );
}

TheseMaster.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutTeacher>{page}</LayoutTeacher>;
};
