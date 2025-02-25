import React, { useEffect, useState } from "react";
import AllSuivis from "@/pages/components/tables/program-manager/AllSuivis";
import LayoutResponsableProgramme from "@/layouts/ResponsableProgramme/LayoutResponsableProgramme";

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
  concern: string | null;
  validation_encadrant: number;
  created_at: string;
  updated_at: string;
}

interface FichiersMaster {
  id_fichiers_master: number;
  id_suivi: number;
  memoire_analytique: string;
  dossier_esquisse: string;
  validation_mis_parcours: number;
  memoire_final: string;
  apd: string;
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

interface Theme {
  id_theme: number;
  theme: string;
  status: number;
  id_etudiant: number;
  created_at: string;
  updated_at: string;
}

interface Suivi {
  id_suivi: number;
  type_suivi: string;
  id_etudiant: number;
  id_enseignant_1: number;
  id_enseignant_2: number;
  id_theme: number | null;
  rapport_actif: number;
  created_at: string;
  updated_at: string;
  rapports: Rapport[];
  fichiers_master: FichiersMaster | null;
  fichiers_licence: FichiersLicence | null;
  etudiant: Etudiant;
  enseignant1: Enseignant;
  enseignant2: Enseignant;
  theme: Theme;
}

export default function Students() {
  const [suivis, setSuivis] = useState<Suivi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/program-manager/suivi", {
          method: "GET",
        });
        const data = await response.json();
        setSuivis(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div style={{ textAlign: "center"}}>
          Chargement...
        </div>
      ) : (
        <AllSuivis suivis={suivis} />
      )}
    </div>
  );
}

Students.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutResponsableProgramme>{page}</LayoutResponsableProgramme>;
};
