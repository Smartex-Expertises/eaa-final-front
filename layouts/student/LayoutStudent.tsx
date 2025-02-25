import React, { ReactNode } from "react";
import Sidebar from "@/pages/components/layout/sidebar/Sidebar";
import Topbar from "@/pages/components/layout/topbar/Topbar";
import styles from "../styleslayout.module.css";
import {
  IoHome,
  IoDocumentText,
  IoHandLeftSharp,
  IoSettings,
  IoCloudUpload,
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

export default function LayoutStudent({ children }: LayoutStudentProps) {
  const links: Link[] = [
    {
      icon: <IoHome />,
      url: "/student",
      text: "Dashboard",
      subLinks: [],
    },
    {
      icon: <IoDocumentText />,
      url: "",
      text: "Mon Mémoire",
      subLinks: [
        {
          icon: <IoDocumentText />,
          url: "/student/thesis/themes",
          text: "Thèmes",
        },
        {
          icon: <IoDocumentText />,
          url: "/student/thesis/rapport",
          text: "Rapports",
        },
        {
          icon: <IoCloudUpload />,
          url: "/student/thesis/upload",
          text: "Téléchargement",
        },
        {
          icon: <IoHandLeftSharp />,
          url: "/student/thesis/avis",
          text: "Avis experts",
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
    //       url: "/student/messages/supervisor",
    //       text: "Encadrant",
    //     },
    //     {
    //       icon: <IoChatbubbles />,
    //       url: "/student/messages/administration",
    //       text: "Administration",
    //     },
    //   ],
    // },
    {
      icon: <IoSettings />,
      url: "",
      text: "Paramètres",
      subLinks: [
        {
          icon: <IoSettings />,
          url: "/student/settings/profile",
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
