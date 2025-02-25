import React from "react";
import LayoutStudent from "@/layouts/student/LayoutStudent";
import { useState } from "react";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
import FormUpdateStudent from "@/pages/components/forms/etudiant/formUpdateStudent/formUpdateStudent";

export default function Profil() {
  const [activeTab, setActiveTab] = useState("perso");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };


  return (
    <div>
      <div>
        <Onglet
          label="Informations personnelles"
          isActive={activeTab === "perso"}
          onClick={() => handleTabChange("perso")}
        />
        {/* <Onglet
          label="Sécurité"
          isActive={activeTab === "secu"}
          onClick={() => handleTabChange("secu")}
        /> */}
      </div>

      <div style={{paddingTop: "1rem"}}>
      <FormUpdateStudent />
      </div>
    </div>
  
);
}

Profil.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutStudent>{page}</LayoutStudent>;
};
