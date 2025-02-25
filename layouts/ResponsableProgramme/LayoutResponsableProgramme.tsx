import React, { ReactNode } from "react";
import Sidebar from "@/pages/components/layout/sidebar/Sidebar";
import Topbar from "@/pages/components/layout/topbar/Topbar";
import styles from "../styleslayout.module.css";

import {
  IoHome,
  IoDocumentText,
  IoAnalyticsSharp,
  IoSettings,
} from "react-icons/io5";

interface SubLink {
  icon: ReactNode;
  url: string;
  text: string;
}

interface Link {
  icon: ReactNode;
  url: string;
  text: string;
  subLinks: SubLink[];
}

interface LayoutStudentProps {
  children: ReactNode;
}

export default function LayoutResponsableProgramme({
  children,
}: LayoutStudentProps) {
  const links: Link[] = [
    {
      icon: <IoHome />,
      url: "/program-manager",
      text: "Dashboard",
      subLinks: [],
    },
    {
      icon: <IoDocumentText />,
      url: "",
      text: "Suivi global",
      subLinks: [
        {
          icon: <IoAnalyticsSharp />,
          url: "/program-manager/thesis/students",
          text: "Progression des étudiants",
        },
      ],
    },
    {
      icon: <IoSettings />,
      url: "",
      text: "Paramètres",
      subLinks: [
        {
          icon: <IoSettings />,
          url: "/program-manager/settings/profile",
          text: "Mon profil",
        },
      ],
    },
  ];

  return (
    <>
      <div className={styles.sidebar}>
        <Sidebar links={links} />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.topbar}>
          <Topbar />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
}
