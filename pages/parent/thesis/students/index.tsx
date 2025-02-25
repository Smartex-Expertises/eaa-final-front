import React, { useEffect, useState } from "react";
import ChildrenTable from "@/pages/components/tables/parent/childrenTable/ChildrenTable";
import LayoutParent from "@/layouts/parent/LayoutParent";

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

export default function Students() {
  const [students, setStudents] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch("/api/parent/students", {
          method: "GET",
        });
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div style={{textAlign: "center"}}>Chargement...</div>
      ) : (
        <div>
          <ChildrenTable children={students} />
        </div>
      )}
    </>
  );
}

Students.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutParent>{page}</LayoutParent>;
};
