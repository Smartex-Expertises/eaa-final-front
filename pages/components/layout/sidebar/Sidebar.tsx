import Link from "next/link";
import React, { useState } from "react";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import styles from "./sidebar.module.css";

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

interface SidebarProps {
  links: Link[];
}

export default function Sidebar({ links }: SidebarProps) {
  const [activeLinks, setActiveLinks] = useState<string[]>([]);
  const router = useRouter();

  const handleToggle = (linkText: string) => {
    setActiveLinks((prevState) => {
      if (prevState.includes(linkText)) {
        return prevState.filter((text) => text !== linkText);
      } else {
        return [...prevState, linkText];
      }
    });
  };

  return (
    <div className={styles.sidebar}>
      {links.map((link) => (
        <div key={link.url} className={styles.linkContainer}>
          <div>
            <Link
              href={link.url}
              className={`${styles.link} ${
                router.pathname === link.url ? styles.active : ""
              }`}
              onClick={() => handleToggle(link.text)}
            >
              {link.icon} {link.text}
              {link.subLinks.length > 0 ? (
                <span className={styles.toggleIcon}>
                  {activeLinks.includes(link.text) ? "−" : "+"}
                </span>
              ) : (
                <div className={styles.toggleIcon}></div>
              )}
            </Link>
          </div>
          {activeLinks.includes(link.text) && (
            <div className={styles.subLinks}>
              {link.subLinks.map((subLink) => (
                <div key={subLink.url} className={styles.subLinkItem}>
                  <Link
                    href={subLink.url}
                    className={`${styles.subLink} ${
                      router.pathname === subLink.url ? styles.active : ""
                    }`}
                  >
                    {subLink.icon} {subLink.text}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
