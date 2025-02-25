import React, { useEffect, useState } from "react";
import TableSuiviMaster from "@/pages/components/tables/scientific-committee/tableSuiviMaster/TableSuiviMaster";
import LayoutCommiteScientifique from "@/layouts/CommiteScientifique/LayoutCommiteScientifique";

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

interface Rapport {
  id_rapport: number;
  id_suivi: number;
  id_auteur: number;
  seance: number;
  date: string;
  heure: string;
  objectifs_seance: string;
  taches_effectuees: string;
  duree_seance: string;
  taches_prochaine_seance: string;
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

interface Expert {
  id_expert: number;
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
  email: string;
  photo: string | null;
  en_ligne: number;
  id_compte: number;
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
  expert: Expert;
}


interface Suivi {
  id_suivi: number;
  type_suivi: string;
  id_etudiant: number;
  id_enseignant_1: number;
  id_enseignant_2: number | null;
  id_theme: string | null;
  rapport_actif: number;
  created_at: string;
  updated_at: string;
  etudiant: Etudiant;
  enseignant1: Enseignant;
  enseignant2: Enseignant;
  rapports: Rapport[];
  fichiers_master: FichiersMaster;
  avis_experts: AvisExpert[];
}

export default function Encadrements() {
  const [suivis, setSuivis] = useState<Suivi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/scientific-committee/StudentMaster");
        const result: Suivi[] = await response.json();
        setSuivis(result);
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
        <div style={{ textAlign: "center" }}>Chargement...</div>
      ) : (
        <TableSuiviMaster suivis={suivis} />
      )}
    </>
  );
}

Encadrements.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutCommiteScientifique>{page}</LayoutCommiteScientifique>;
};
