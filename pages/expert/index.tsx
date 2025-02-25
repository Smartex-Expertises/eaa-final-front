import React from "react";
import LayoutExpert from "@/layouts/expert/LayoutExpert";

export default function Dashboard() {
  return <div>Dashboard Expert</div>;
}
Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutExpert>{page}</LayoutExpert>;
};
