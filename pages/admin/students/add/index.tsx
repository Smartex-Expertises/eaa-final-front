import React, { useState } from "react";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
import FormAddStudent from "@/pages/components/forms/admin/formAddStudent/FormAddStudent";
import FormFileStudents from "@/pages/components/forms/admin/formFileStudents/FormFileStudents";


export default function Add() {
  const [activeTab, setActiveTab] = useState("form");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        <Onglet
          label="Formulaire d'ajout d'un étudiant"
          isActive={activeTab === "form"}
          onClick={() => handleTabChange("form")}
        />
        <Onglet
          label="Ajouter plusieurs étudiants"
          isActive={activeTab === "file"}
          onClick={() => handleTabChange("file")}
        />
      </div>

      <div style={{paddingTop: "1rem"}}>
        {activeTab === "form" ? <FormAddStudent /> : <FormFileStudents />}
      </div>
    </div>
  );
}

Add.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
