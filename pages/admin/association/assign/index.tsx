import React, { useState } from "react";
import FormAssignTeacherStudentLicence from "@/pages/components/forms/admin/formAssignTeacherStudentLicence/FormAssignTeacherStudentLicence";
import FormAssignTeacherStudentMaster from "@/pages/components/forms/admin/formAssignTeacherStudentMaster/FormAssignTeacherStudentMaster";
import Onglet from "@/pages/components/buttons/onglet/Onglet";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";

export default function Assign() {
  const [activeTab, setActiveTab] = useState("licence");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        <Onglet
          label="Association encadrant et étudiant de Licence"
          isActive={activeTab === "licence"}
          onClick={() => handleTabChange("licence")}
        />
        <Onglet
          label="Association encadrant et étudiant de Master"
          isActive={activeTab === "master"}
          onClick={() => handleTabChange("master")}
        />
      </div>
      <div style={{ paddingTop: "1rem" }}>
        {activeTab === "licence" ? (
          <FormAssignTeacherStudentLicence />
        ) : (
          <FormAssignTeacherStudentMaster />
        )}
      </div>
    </div>
  );
}

Assign.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
