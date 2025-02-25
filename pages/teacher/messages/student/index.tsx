import React from "react";
import LayoutTeacher from "@/layouts/teacher/LayoutTeacher";

export default function Student() {
  return <div>Student</div>;
}

Student.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutTeacher>{page}</LayoutTeacher>;
};
