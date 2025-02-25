import React, { useEffect, useState } from "react";
import TableSuiviExpertMaster from "@/pages/components/tables/expert/tableSuiviExpertMaster/TableSuiviExpertMaster";
import LayoutExpert from "@/layouts/expert/LayoutExpert";

export interface FichiersMaster {
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

interface AvisExpert {
  id_avis: number;
  id_suivi: number;
  id_expert:number;
  avis: string;
  created_at: string;
  updated_at: string;
}

export interface Suivi {
  id_suivi: number;
  type_suivi: string;
  id_etudiant: number;
  id_enseignant_1: number;
  id_enseignant_2: number;
  id_theme: string | null;
  rapport_actif: number;
  created_at: string;
  updated_at: string;
  fichiers_master: FichiersMaster;
  theme: {
    id_theme: number;
    theme: string;
    status: number;
    id_etudiant: number;
    created_at: string;
    updated_at: string;
  } | null;
  enseignant1: { nom: string; prenom: string };
  enseignant2: { nom: string; prenom: string };
  avis_experts: AvisExpert[];
}

export interface Etudiant {
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
  suivis_memoire: Suivi[];
}

export interface ResponseData {
  id_expert_etudiant: number;
  id_expert: number;
  id_etudiant: number;
  created_at: string;
  updated_at: string;
  etudiant: Etudiant;
}

export default function Master() {
  const [studentData, setStudentData] = useState<Etudiant[]>([]); // Array of students
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/expert/studentsMaster");
        const result: ResponseData[] = await response.json();
        if (result.length > 0) {
          // We store all students into the state
          setStudentData(result.map((response) => response.etudiant));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center" }}>Chargement...</div>;
  }

  if (studentData.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        Aucun étudiant assigné pour l'instant
      </div>
    );
  }

  return (
    <div>
      {/* Pass the whole studentData array to TableSuiviExpertMaster */}
      <TableSuiviExpertMaster data={studentData} />
    </div>
  );
}

Master.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutExpert>{page}</LayoutExpert>;
};
