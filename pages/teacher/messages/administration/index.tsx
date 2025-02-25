import React from "react";
import LayoutTeacher from "@/layouts/teacher/LayoutTeacher";

export default function Administration() {
  return <div>Administration</div>;
}

Administration.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutTeacher>{page}</LayoutTeacher>;
};