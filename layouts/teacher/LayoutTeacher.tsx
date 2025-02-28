import React, { ReactNode } from "react";
import Sidebar from "@/pages/components/layout/sidebar/Sidebar";
import Topbar from "@/pages/components/layout/topbar/Topbar";
import styles from "../styleslayout.module.css";
import { IoHome, IoSettings, IoPeople } from "react-icons/io5";

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

interface LayoutTeacherProps {
  children: ReactNode;
}

export default function LayoutTeacher({ children }: LayoutTeacherProps) {
  const links: Link[] = [
    {
      icon: <IoHome />,
      url: "/teacher",
      text: "Dashboard",
      subLinks: [],
    },
    {
      icon: <IoPeople />,
      url: "#",
      text: "Mes étudiants",
      subLinks: [
        {
          icon: <IoPeople />,
          url: "/teacher/these/licence",
          text: "Suivi mémoire Licence 3",
        },
        {
          icon: <IoPeople />,
          url: "/teacher/these/master",
          text: "Suivi mémoire Master 2",
        },
      ],
    },
    // {
    //   icon: <IoChatbubbles />,
    //   url: "#",
    //   text: "Communication",
    //   subLinks: [
    //     {
    //       icon: <IoChatbubbles />,
    //       url: "/teacher/messages/student",
    //       text: "Étudiants",
    //     },
    //     {
    //       icon: <IoChatbubbles />,
    //       url: "/teacher/messages/administration",
    //       text: "Administration",
    //     },
    //   ],
    // },
    // {
    //   icon: <IoSettings />,
    //   url: "#",
    //   text: "Paramètres",
    //   subLinks: [
    //     {
    //       icon: <IoSettings />,
    //       url: "/teacher/settings/profile",
    //       text: "Profil",
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
