import React from "react";
import LayoutParent from "@/layouts/parent/LayoutParent";

export default function Supervisor() {
  return <div>Supervisor</div>;
}

Supervisor.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutParent>{page}</LayoutParent>;
};
