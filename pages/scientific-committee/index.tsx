import React from "react";
import LayoutCommiteScientifique from "@/layouts/CommiteScientifique/LayoutCommiteScientifique";

export default function Dashboard() {
  return <div>Dashboard Comité Scientifique</div>;
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutCommiteScientifique>{page}</LayoutCommiteScientifique>;
};
