import React, { useEffect, useState } from "react";
import TableThemes from "@/pages/components/tables/scientific-committee/tableThemes/TableThemes";
import LayoutCommiteScientifique from "@/layouts/CommiteScientifique/LayoutCommiteScientifique";
import { toast } from "react-toastify";

type Theme = {
  id_theme: number;
  theme: string;
  status: number;
};

type Student = {
  id_etudiant: number;
  matricule: string;
  nom: string;
  prenom: string;
  niveau: string;
  classe: string;
  themes: Theme[];
};

type ApiResponse = {
  message: string;
  data: Student[];
};

export default function Themes() {
  const [studentsThemes, setStudentsThemes] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/theme/studentsThemes", {
          method: "GET",
        });
        const data: ApiResponse = await response.json();

        if (data && Array.isArray(data.data)) {
          setStudentsThemes(data.data);
        } else {
          toast.error("Aucune donnée trouvée");
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors du chargement des thèmes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p style={{textAlign: "center"}}>Chargement...</p>
      ) : (
        <TableThemes studentsThemes={studentsThemes} />
      )}
    </div>
  );
}

// Layout spécifique pour cette page
Themes.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutCommiteScientifique>{page}</LayoutCommiteScientifique>;
};
