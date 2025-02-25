import React, { useEffect, useState } from "react";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";
import TableExperts from "@/pages/components/tables/admin/tableExperts/TableExperts";

interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom_etudiant: string;
  prenom_etudiant: string;
  niveau: string;
  classe: string;
}

interface Expert {
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
  email: string;
  etudiants: Etudiant[];
}

export default function ListeExperts() {
  const [data, setData] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/expert/expert", {
          method: "GET",
        });

        const result = await response.json();

        if (response.ok && result && Array.isArray(result.data)) {
          const formattedData: Expert[] = result.data.map((expert: any) => ({
            nom: expert.nom,
            prenom: expert.prenom,
            specialite: expert.specialite,
            telephone: expert.telephone,
            email: expert.email,
            etudiants: expert.etudiants
              ? expert.etudiants.map((etudiant: any) => ({
                  id_etudiant: etudiant.id_etudiant,
                  matricule: etudiant.matricule,
                  nom_etudiant: etudiant.nom,
                  prenom_etudiant: etudiant.prenom,
                  niveau: etudiant.niveau,
                  classe: etudiant.classe,
                }))
              : [],
          }));

          setData(formattedData);
        } else {
          setError("Données invalides reçues du serveur.");
        }
      } catch (error) {
        setError(
          "Une erreur est survenue lors de la récupération des données."
        );
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length) {
      console.log("Données mises à jour:", data);
    }
  }, [data]);

  return (
    <>
      <h2>Liste des experts ajoutés</h2>
      <div style={{ paddingTop: "1rem" }}>
        {isLoading ? (
          <p style={{textAlign: "center"}}>Chargement...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : data.length === 0 ? (
          <p>Aucun expert ajouté</p>
        ) : (
          <TableExperts data={data} />
        )}
      </div>
    </>
  );
}

ListeExperts.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
