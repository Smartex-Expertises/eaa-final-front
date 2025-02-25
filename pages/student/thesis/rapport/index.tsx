import React, { useEffect, useState } from "react";
import TableRapportsLicence from "@/pages/components/tables/etudiant/tableRapportsLicence/TableRapportsLicence";
import TableRapportsMaster from "@/pages/components/tables/etudiant/tableRapportMaster/TableRapportsMaster";
import LayoutStudent from "@/layouts/student/LayoutStudent";

interface Rapport {
  id_rapport: number;
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
  validation_encadrant: number;
  updated_at: string;
}

interface Suivi {
  id_suivi: number;
  type_suivi: "Licence" | "Master";
  id_etudiant: number;
  id_enseignant_1: number | null;
  id_enseignant_2: number | null;
  rapports: Rapport[];
}

export default function Rapport() {
  const [suivi, setSuivi] = useState<Suivi | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/student/rapports`);
        if (!response.ok) {
          throw new Error(
            "Une erreur s'est produite lors du chargement des données."
          );
        }

        const data = await response.json();
        setSuivi(data[0]);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", fontSize: "18px", color: "blue" }}>
        Chargement en cours...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red", fontSize: "18px" }}>
        {error}
      </div>
    );
  }

  if (!suivi) {
    return (
      <div style={{ textAlign: "center", fontSize: "18px", marginTop: "20px" }}>
        Aucun suivi trouvé.
      </div>
    );
  }

  const isLicence = suivi.type_suivi === "Licence";
  const currentDate = new Date();

  return (
    <div>
      {suivi.rapports.length > 0 ? (
        isLicence ? (
          <>
            <TableRapportsLicence rapports={suivi.rapports} />
          </>
        ) : (
          <>
            <TableRapportsMaster rapports={suivi.rapports} />
          </>
        )
      ) : (
        <div
          style={{ textAlign: "center", fontSize: "18px", marginTop: "20px" }}
        >
          Aucun rapport trouvé.
        </div>
      )}
    </div>
  );
}

Rapport.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutStudent>{page}</LayoutStudent>;
};
