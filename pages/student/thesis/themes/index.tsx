import React, { useState, useEffect } from "react";
import FormTheme from "@/pages/components/forms/etudiant/formTheme/FormTheme";
import LayoutStudent from "@/layouts/student/LayoutStudent";

export default function Themes() {
  return (
    <div>
      <FormTheme />
    </div>
  );
}

Themes.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutStudent>{page}</LayoutStudent>;
};
