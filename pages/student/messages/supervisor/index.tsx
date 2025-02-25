import React from "react";
import LayoutStudent from "@/layouts/student/LayoutStudent";

export default function Supervisor() {
  return <div>Supervisor</div>;
}

Supervisor.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutStudent>{page}</LayoutStudent>;
};
