import React, { useEffect, useState } from "react";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";
import TableStudents from "@/pages/components/tables/admin/tableStudents/TableStudents";

interface Parent {
  id_parent: number;
  nom_complet_parent: string;
  email_parent: string;
  telephone_parent: string;
}

interface Student {
  id_etudiant: number;
  matricule: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  niveau: string;
  classe: string;
  parent: Parent;
}

export default function ListeStudents() {
  const [data, setData] = useState<Student[]>([]);
  const [isLoadingGetClasse, setIsLoadingGetClasse] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingGetClasse(true);
      try {
        const response = await fetch("/api/student/student", {
          method: "GET",
        });
        const result = await response.json();

        if (result && Array.isArray(result)) {
          const formattedData = result.map((student: any) => ({
            id_etudiant: student.id_etudiant,
            matricule: student.matricule,
            nom: student.nom,
            prenom: student.prenom,
            telephone: student.telephone,
            email: student.email,
            niveau: student.niveau,
            classe: student.classe,
            parent: student.parent
              ? {
                  id_parent: student.parent.id_parent,
                  nom_complet_parent: student.parent.nom_complet_parent,
                  email_parent: student.parent.email_parent || "",
                  telephone_parent: student.parent.telephone_parent || "",
                }
              : {
                  id_parent: 0,
                  nom_complet_parent: "",
                  email_parent: "",
                  telephone_parent: "",
                },
          }));

          setData(formattedData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setIsLoadingGetClasse(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div style={{ paddingTop: "1rem" }}>
        {isLoadingGetClasse ? (
          <p style={{ textAlign: "center" }}>Chargement...</p>
        ) : (
          <TableStudents data={data} />
        )}
      </div>
    </div>
  );
}

ListeStudents.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
