import React from "react";
import LayoutTeacher from "@/layouts/teacher/LayoutTeacher";
import { useState } from "react";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
import FormUpdateTeacher from "@/pages/components/forms/enseignant/formUpdateTeacher/formUpdateTeacher";

export default function Profile() {
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
       
      </div>

      <div style={{paddingTop: "1rem"}}>
      <FormUpdateTeacher />
      </div>
    </div>
  )
}

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutTeacher>{page}</LayoutTeacher>;
};
