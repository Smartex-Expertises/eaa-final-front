import React from "react";
import LayoutResponsableProgramme from "@/layouts/ResponsableProgramme/LayoutResponsableProgramme";
export default function Dashboard() {
  return <div>Dashboard Responsable Programme</div>;
}
Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutResponsableProgramme>{page}</LayoutResponsableProgramme>;
};
