import React from "react";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";
import { useState } from "react";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
import FormAddTeacher from "@/pages/components/forms/admin/formAddTeacher/FormAddTeacher";
import FormFileTeachers from "@/pages/components/forms/admin/formFileTeachers/FormFileTeachers";
import FormUpdateAdmin from "@/pages/components/forms/admin/formUpdateAdmin/formUpdateAdmin";
import FormUpdatePassword from "@/pages/components/forms/admin/formUpdatePassword/formUpdatePassword";
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
        <Onglet
          label="Sécurité"
          isActive={activeTab === "secu"}
          onClick={() => handleTabChange("secu")}
        />
      </div>

      <div style={{paddingTop: "1rem"}}>
        {activeTab === "perso" ? <FormUpdateAdmin /> : <FormUpdatePassword />}
      </div>
    </div>
  
);
}







Profile.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
