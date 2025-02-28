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

interface LayoutStudentProps {
  children: ReactNode;
}

export default function LayoutExpert({ children }: LayoutStudentProps) {
  const links: Link[] = [
    {
      icon: <IoHome />,
      url: "/expert",
      text: "Dashboard",
      subLinks: [],
    },
    {
      icon: <IoPeople />,
      url: "",
      text: "Etudiants",
      subLinks: [
        {
          icon: <IoPeople />,
          url: "/expert/these/licence",
          text: "Mémoires licence 3",
        },
        {
          icon: <IoPeople />,
          url: "/expert/these/master",
          text: "Mémoires master 2",
        },
      ],
    },
    // {
    //   icon: <IoSettings />,
    //   url: "#",
    //   text: "Paramètres",
    //   subLinks: [
    //     {
    //       icon: <IoSettings />,
    //       url: "/expert/settings/profile",
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
