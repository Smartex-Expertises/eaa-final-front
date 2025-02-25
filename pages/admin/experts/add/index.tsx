import React from "react";
import FormAddExpert from "@/pages/components/forms/admin/formAddExpert/FormAddExpert";
import LayoutAdmin from "@/layouts/admin/LayoutAdmin";

export default function Add() {
  return (
    <div>
      <FormAddExpert />
    </div>
  );
}

Add.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
