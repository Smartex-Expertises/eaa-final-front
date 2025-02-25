import React, { useEffect, useState } from "react";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";
import TableTeachers from "@/pages/components/tables/admin/tableTeachers/TableTeachers";

export default function ListeTeachers() {
  const [data, setData] = useState<(string | number)[][]>([]);
  const [isLoadingGetClasse, setIsLoadingGetClasse] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingGetClasse(true);
      try {
        const response = await fetch("/api/teacher/teacher", {
          method: "GET",
        });
        const result = await response.json();

        if (result && Array.isArray(result)) {
          const formattedData = result.map((teacher: any) => [
            teacher.matricule,
            teacher.nom,
            teacher.prenom,
            teacher.type,
            teacher.specialite,
            teacher.grade,
            teacher.telephone,
            teacher.email,
          ]);

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingGetClasse(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Liste des enseignants ajoutés</h2>
      <div style={{ paddingTop: "1rem" }}>
        {isLoadingGetClasse ? (
          <div style={{ textAlign: "center" }}>Chargement...</div>
        ) : (
          <TableTeachers data={data} />
        )}
      </div>
    </div>
  );
}

ListeTeachers.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
