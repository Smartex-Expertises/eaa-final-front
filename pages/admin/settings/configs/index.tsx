import React, { useState } from "react";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";
import FormCotas from "@/pages/components/forms/admin/formCotas/FormCotas";
import FormDefaultPassword from "@/pages/components/forms/admin/formDefaultPassword/FormDefaultPassword";
import FormClasse from "@/pages/components/forms/admin/formClasse/FormClasse";
import FormDatesLimites from "@/pages/components/forms/admin/formDatesLimites/FormDatesLimites";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
import FormAdminAccounts from "@/pages/components/forms/admin/formAdminAccounts/FormAdminAccounts";

export default function Configs() {
  const [activeTab, setActiveTab] = useState("passwords");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="configs-container">
      <div className="tabs">
        {/* Onglet pour les mots de passe */}
        <Onglet
          label="Mot de passe par défaut"
          isActive={activeTab === "passwords"}
          onClick={() => handleTabChange("passwords")}
        />

        <Onglet
          label="Classes de Licence 3 et Master 2"
          isActive={activeTab === "classes"}
          onClick={() => handleTabChange("classes")}
        />

        <Onglet
          label="Dates limites"
          isActive={activeTab === "dates"}
          onClick={() => handleTabChange("dates")}
        />

        <Onglet
          label="Cotas encadrement"
          isActive={activeTab === "cotas"}
          onClick={() => handleTabChange("cotas")}
        />

        <Onglet
          label="Comptes administrateurs"
          isActive={activeTab === "comptes"}
          onClick={() => handleTabChange("comptes")}
        />
      </div>

      <div>
        {activeTab === "passwords" && <FormDefaultPassword />}
        {activeTab === "classes" && <FormClasse />}
        {activeTab === "dates" && <FormDatesLimites />}
        {activeTab === "cotas" && <FormCotas />}
        {activeTab === "comptes" && <FormAdminAccounts />}{" "}
      </div>
    </div>
  );
}

Configs.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
