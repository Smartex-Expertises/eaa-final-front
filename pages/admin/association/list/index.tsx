import React, { useEffect, useState } from "react";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
import TableEncadrementStudent from "@/pages/components/tables/admin/tableEncadrementStudent/TableEncadrementStudent";
import TableEncadrementTeacher from "@/pages/components/tables/admin/tableEncadrementTeacher/TableEncadrementTeacher";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";

interface Encadrant {
  id_enseignant: number;
  nom_enseignant: string;
  prenom_enseignant: string;
  type: string;
}

interface Student {
  id_etudiant: number;
  matricule: string;
  nom_etudiant: string;
  prenom_etudiant: string;
  niveau: string;
  classe: string;
  encadrants: Encadrant[];
}

interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom_etudiant: string;
  prenom_etudiant: string;
  niveau: string;
  classe: string;
}

interface Encadrant2 {
  id_encadrant: number;
  matricule: string;
  nom_enseignant: string;
  prenom_enseignant: string;
  type: string;
  etudiants: Etudiant[];
}



export default function Encadrement() {
  const [encadrementStudent, setEncadrementStudent] = useState<Student[]>([]);
  const [encadrementTeacher, setEncadrementTeacher] = useState<Encadrant2[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("etudiant");

  useEffect(() => {
    const fetchDataStudents = async () => {
      try {
        const response = await fetch(
          "/api/encadrement/getStudentsWithTeachers",
          { method: "GET" }
        );
        const result: Record<string, Student> = await response.json();

        if (result && Object.values(result).length > 0) {
          const formattedStudents = Object.values(result).map(
            (student) => ({
              id_etudiant: student.id_etudiant,
              matricule: student.matricule,
              nom_etudiant: student.nom_etudiant,
              prenom_etudiant: student.prenom_etudiant,
              niveau: student.niveau,
              classe: student.classe,
              encadrants: student.encadrants.map((encadrant) => ({
                id_enseignant: encadrant.id_enseignant,
                nom_enseignant: encadrant.nom_enseignant,
                prenom_enseignant: encadrant.prenom_enseignant,
                type: encadrant.type,
              })),
            })
          );
          setEncadrementStudent(formattedStudents);
        } else {
          console.error("Unexpected structure for student data:", result);
        }
      } catch (error) {
        setError("Error fetching student data.");
        console.error("Error fetching student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataStudents();
  }, []);

  useEffect(() => {
    const fetchDataTeachers = async () => {
      try {
        const response = await fetch(
          "/api/encadrement/getTeachersWithStudents",
          { method: "GET" }
        );
        const result = await response.json();

        if (result && Object.values(result).length > 0) {
          const formattedTeachers = Object.values(result).map(
            (encadrant: any) => ({
              id_encadrant: encadrant.encadrant.id_encadrant,
              matricule: encadrant.encadrant.matricule,
              nom_enseignant: encadrant.encadrant.nom_enseignant,
              prenom_enseignant: encadrant.encadrant.prenom_enseignant,
              type: encadrant.encadrant.type,
              etudiants: encadrant.etudiants.map((etudiant: any) => ({
                id_etudiant: etudiant.id_etudiant,
                matricule: etudiant.matricule,
                nom_etudiant: etudiant.nom_etudiant,
                prenom_etudiant: etudiant.prenom_etudiant,
                niveau: etudiant.niveau,
                classe: etudiant.classe,
              })),
            })
          );
          setEncadrementTeacher(formattedTeachers);
        } else {
          console.error("Unexpected structure for teacher data:", result);
        }
      } catch (error) {
        setError("Error fetching teacher data.");
        console.error("Error fetching teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataTeachers();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        <Onglet
          label="Etudiants - Encadrants"
          isActive={activeTab === "etudiant"}
          onClick={() => handleTabChange("etudiant")}
        />
        <Onglet
          label="Encadrants - Etudiants"
          isActive={activeTab === "enseignant"}
          onClick={() => handleTabChange("enseignant")}
        />
      </div>

      <div style={{ paddingTop: "1rem" }}>
        {isLoading ? (
          <div style={{ textAlign: "center" }}>Chargement...</div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "red" }}>{error}</div>
        ) : activeTab === "etudiant" ? (
          <TableEncadrementStudent data={encadrementStudent} />
        ) : (
          <TableEncadrementTeacher data={encadrementTeacher} />
        )}
      </div>
    </div>
  );
}

Encadrement.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
