import React, { ReactNode } from "react";
import styles from "../styleslayout.module.css";
import Sidebar from "@/pages/components/layout/sidebar/Sidebar";
import Topbar from "@/pages/components/layout/topbar/Topbar";

import {
  IoHome,
  IoSettings,
  IoPerson,
  IoPersonSharp,
  IoPersonAdd,
  IoLink,
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

interface LayoutAdminProps {
  children: ReactNode;
}

export default function LayoutAdmin({ children }: LayoutAdminProps) {
  const links: Link[] = [
    {
      icon: <IoHome />,
      url: "/admin",
      text: "Dashboard",
      subLinks: [],
    },
    {
      icon: <IoPerson />,
      url: "",
      text: "Étudiants",
      subLinks: [
        {
          icon: <IoPerson />,
          url: "/admin/students/list",
          text: "Liste des étudiants",
        },
        {
          icon: <IoPersonAdd />,
          url: "/admin/students/add",
          text: "Ajouter des étudiants",
        },
      ],
    },
    {
      icon: <IoPersonSharp />,
      url: "",
      text: "Directeurs de mémoire",
      subLinks: [
        {
          icon: <IoPersonSharp />,
          url: "/admin/teachers/list",
          text: "Liste des directeurs de mémoire",
        },
        {
          icon: <IoPersonAdd />,
          url: "/admin/teachers/add",
          text: "Ajouter des directeurs de mémoire",
        },
      ],
    },
    {
      icon: <IoLink />,
      url: "",
      text: "Encadrement",
      subLinks: [
        {
          icon: <IoLink />,
          url: "/admin/association/assign",
          text: "Associer étudiant et directeurs de mémoire",
        },
        {
          icon: <IoLink />,
          url: "/admin/association/list",
          text: "Liste des encadrements",
        },
      ],
    },
    {
      icon: <IoPersonSharp />,
      url: "",
      text: "Experts",
      subLinks: [
        {
          icon: <IoPersonSharp />,
          url: "/admin/experts/list",
          text: "Liste des experts",
        },
        {
          icon: <IoPersonAdd />,
          url: "/admin/experts/add",
          text: "Ajouter des experts",
        },
        {
          icon: <IoLink />,
          url: "/admin/experts/assign",
          text: "Assigner les experts",
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
          url: "/admin/settings/configs",
          text: "Configurations",
        },
        {
          icon: <IoSettings />,
          url: "/admin/settings/profile",
          text: "Profil",
        },
        {
          icon: <IoPersonSharp />,
          url: "/admin/settings/list",
          text: "Liste des comptes admin",
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
