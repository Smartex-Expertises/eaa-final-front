import React, { ReactNode } from "react";
import Sidebar from "@/pages/components/layout/sidebar/Sidebar";
import Topbar from "@/pages/components/layout/topbar/Topbar";
import styles from "../styleslayout.module.css";

import {
  IoHome,
  IoDocumentText,
  IoSettings,
  IoGitNetwork,
  IoLink
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

export default function LayoutCommiteScientifique({
  children,
}: LayoutStudentProps) {
  const links: Link[] = [
    {
      icon: <IoHome />,
      url: "/scientific-committee",
      text: "Dashboard",
      subLinks: [],
    },
    {
      icon: <IoGitNetwork />,
      url: "",
      text: "Suivis",
      subLinks: [
        {
          icon: <IoDocumentText />,
          url: "/scientific-committee/suivis/themes",
          text: "Thèmes",
        },
        {
          icon: <IoLink />,
          url: "/scientific-committee/suivis/encadrements/licence",
          text: "Mémoires Licence",
        },
        {
          icon: <IoLink />,
          url: "/scientific-committee/suivis/encadrements/master",
          text: "Mémoires Master",
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
          url: "/scientific-committee/settings/profile",
          text: "Profil",
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
