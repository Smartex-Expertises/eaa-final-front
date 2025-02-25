import React, { useEffect, useState } from "react";
import TableSuiviExpertLicence from "@/pages/components/tables/expert/tableSuiviExpertLicence/TableSuiviExpertLicence";
import LayoutExpert from "@/layouts/expert/LayoutExpert";

interface FichiersLicence {
  id_fichiers_licence: number;
  id_suivi: number;
  memoire_final: string | null;
  apd: string | null;
  validation_finale: number;
  created_at: string;
  updated_at: string;
}

interface AvisExpert {
  id_avis: number;
  id_suivi: number;
  id_expert: number;
  avis: string;
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
  fichiers_licence: FichiersLicence;
  theme: {
    id_theme: number;
    theme: string;
    status: number;
    id_etudiant: number;
    created_at: string;
    updated_at: string;
  } | null;
  avis_experts: AvisExpert[];
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
  suivis_memoire: Suivi[];
}

interface ResponseData {
  id_expert_etudiant: number;
  id_expert: number;
  id_etudiant: number;
  created_at: string;
  updated_at: string;
  etudiant: Etudiant;
}

export default function Licence() {
  const [studentData, setStudentData] = useState<Etudiant[]>([]); // Changer en tableau d'étudiants
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/expert/studentsLicence");
        const result: ResponseData[] = await response.json();
        if (result.length > 0) {
          // On récupère le premier étudiant et on le place dans un tableau
          setStudentData([result[0].etudiant]);
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
      {studentData.length > 0 ? (
        <TableSuiviExpertLicence data={studentData} />
      ) : (
        <div style={{ textAlign: "center" }}>
          Vous n'avez pas encore de mémoire à consulter
        </div>
      )}
    </div>
  );
}

Licence.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutExpert>{page}</LayoutExpert>;
};
