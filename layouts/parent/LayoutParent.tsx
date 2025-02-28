import React, { ReactNode } from "react";
import Sidebar from "@/pages/components/layout/sidebar/Sidebar";
import Topbar from "@/pages/components/layout/topbar/Topbar";
import styles from "../styleslayout.module.css";

import {
  IoHome,
  IoDocumentText,
  IoChatbubbles,
  IoSettings,
  IoAnalyticsSharp,
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

interface LayoutParentProps {
  children: ReactNode;
}

export default function LayoutParent({ children }: LayoutParentProps) {
  const links: Link[] = [
    {
      icon: <IoHome />,
      url: "/parent",
      text: "Dashboard",
      subLinks: [],
    },
    {
      icon: <IoDocumentText />,
      url: "",
      text: "Suivi de mémoire",
      subLinks: [
        {
          icon: <IoAnalyticsSharp />,
          url: "/parent/thesis/students",
          text: "Avancée de mes enfants",
        },
      ],
    },
    // {
    //   icon: <IoChatbubbles />,
    //   url: "",
    //   text: "Communication",
    //   subLinks: [
    //     {
    //       icon: <IoChatbubbles />,
    //       url: "/parent/messages/supervisor",
    //       text: "Encadrant",
    //     },
    //     {
    //       icon: <IoChatbubbles />,
    //       url: "/parent/messages/administration",
    //       text: "Administration",
    //     },
    //   ],
    // },
    // {
    //   icon: <IoSettings />,
    //   url: "",
    //   text: "Paramètres",
    //   subLinks: [
    //     {
    //       icon: <IoSettings />,
    //       url: "/parent/settings/profile",
    //       text: "Mon profil",
    //     },
    //   ],
    // },
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
