import React from "react";
import LayoutCommiteScientifique from "@/layouts/CommiteScientifique/LayoutCommiteScientifique";

export default function Profil() {
  return <div>Profil</div>;
}

Profil.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutCommiteScientifique>{page}</LayoutCommiteScientifique>;
};
