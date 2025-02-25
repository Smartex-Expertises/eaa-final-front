import React, { useEffect, useState } from "react";
import TableRapportsLicence from "@/pages/components/tables/enseignant/tableRapportsLicence/TableRapportsLicence";
import { useRouter } from "next/router";
import LayoutTeacher from "@/layouts/teacher/LayoutTeacher";
import AddBtn from "@/pages/components/buttons/add/AddBtn";
import ModalAddRapport from "@/pages/components/modals/modalAddRapport/ModalAddRapport";

interface Rapport {
  id_rapport: number;
  id_suivi: number;
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
  created_at: string;
  updated_at: string;
}

export default function RapportPage() {
  const [rapports, setRapports] = useState<Rapport[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const router = useRouter();
  const { suiviId } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      if (!suiviId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/teacher/rapports?suiviId=${suiviId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              "Une erreur s'est produite lors du chargement des données."
          );
        }

        const data = await response.json();
        setRapports(data.suivi?.rapports || []);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (suiviId) {
      fetchData();
    }
  }, [suiviId]);

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

  return (
    <div>
      <AddBtn onClick={() => setIsModalOpen(true)} />

      {rapports && rapports.length > 0 ? (
        <TableRapportsLicence rapports={rapports} />
      ) : (
        <div
          style={{ textAlign: "center", fontSize: "18px", marginTop: "20px" }}
        >
          Aucun rapport trouvé.
        </div>
      )}

      {isModalOpen && (
        <ModalAddRapport
          suiviId={suiviId as string}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

RapportPage.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutTeacher>{page}</LayoutTeacher>;
};
