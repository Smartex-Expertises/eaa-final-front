import React from "react";
import FormAssignExpert from "@/pages/components/forms/admin/formAssignExpert/FormAssignExpert";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";

export default function Assign() {
  return (
    <div>
      <FormAssignExpert />
    </div>
  );
}

Assign.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
