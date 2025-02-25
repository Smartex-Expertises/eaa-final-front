import React from "react";
import LayoutParent from "@/layouts/parent/LayoutParent";
import { useState } from "react";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
import FormUpdateParent from "@/pages/components/forms/admin/formUpdateParent/formUpdateParent";

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
      <FormUpdateParent />
      </div>
    </div>
  
);
}

Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutParent>{page}</LayoutParent>;
};
