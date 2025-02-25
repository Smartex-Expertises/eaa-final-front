import React from "react";
import UploadFinalMaster from "@/pages/components/forms/etudiant/uploadFinalMaster/UploadFinalMaster";
import UploadMisParcoursMaster from "@/pages/components/forms/etudiant/uploadMisParcoursMaster/UploadMisParcoursMaster";
// import UploadFinalLicence from "@/pages/components/forms/etudiant/uploadFinalLicence/UploadFinalLicence";
import LayoutStudent from "@/layouts/student/LayoutStudent";

export default function Upload() {
  return (
    <div>
      <UploadMisParcoursMaster />
      <br />
      <UploadFinalMaster />
      {/* <br />
      <UploadFinalLicence /> */}
    </div>
  );
}

Upload.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutStudent>{page}</LayoutStudent>;
};
