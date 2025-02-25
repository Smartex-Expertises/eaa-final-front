import React from "react";
import LayoutExpert from "@/layouts/expert/LayoutExpert";
import { useState } from "react";
import FormUpdateExpert from "@/pages/components/forms/admin/formUpdateExpert/formUpdateExpert";
import Onglet from "@/pages/components/buttons/onglet/Onglet";

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
      <FormUpdateExpert />
      </div>
    </div>
  )
}

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutExpert>{page}</LayoutExpert>;
};
