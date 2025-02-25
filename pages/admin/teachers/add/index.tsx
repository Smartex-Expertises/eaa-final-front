import React, { useState } from "react";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";
import FormAddTeacher from "@/pages/components/forms/admin/formAddTeacher/FormAddTeacher";
import FormFileTeachers from "@/pages/components/forms/admin/formFileTeachers/FormFileTeachers";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
export default function Add() {
  const [activeTab, setActiveTab] = useState("form");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        <Onglet
          label="Formulaire d'ajout d'un enseignant"
          isActive={activeTab === "form"}
          onClick={() => handleTabChange("form")}
        />
        <Onglet
          label="Ajouter plusieurs enseignants"
          isActive={activeTab === "file"}
          onClick={() => handleTabChange("file")}
        />
      </div>

      <div style={{paddingTop: "1rem"}}>
        {activeTab === "form" ? <FormAddTeacher /> : <FormFileTeachers />}
      </div>
    </div>
  );
}

Add.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
