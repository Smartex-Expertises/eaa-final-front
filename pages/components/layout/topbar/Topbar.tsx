import React, { useState, useEffect } from "react";
import ConfirmModal from "../../modals/confirmModal/ConfirmModal";
import { useRouter } from "next/navigation";
import styles from "./topbar.module.css";
import { IoArrowForward } from "react-icons/io5";
import Image from "next/image";

type UserInfo = {
  nom: string;
  prenom: string;
  photo: string | null;
  initiales: string | null;
};

export default function Topbar() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur de connexion à l'API de déconnexion", error);
    }

    setIsModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/auth/user_info", {
          method: "GET",
        });
        const data = await response.json();

        setUserInfo({
          nom: data.nom || "",
          prenom: data.prenom || "",
          photo: data.photo || null,
          initiales: data.initiales || null,
        });
      } catch {
        console.log("une erreur s'est produite");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayMessage = !userInfo || (!userInfo.photo && !userInfo.initiales);

  return (
    <div className={styles.topbar}>
      <div className={styles.userInfo}>
        {loading ? (
          <div className={styles.loader}></div>
        ) : displayMessage ? (
          <span className={styles.noProfile}>Complétez votre profil...</span>
        ) : (
          <>
            {userInfo?.photo ? (
              <Image
                src={userInfo.photo}
                alt="User Avatar"
                className={styles.userAvatar}
              />
            ) : userInfo?.initiales ? (
              <span className={styles.initiales}>{userInfo.initiales}</span>
            ) : null}
            <span>
              {userInfo ? `${userInfo.nom} ${userInfo.prenom}` : "Utilisateur"}
            </span>
          </>
        )}
      </div>

      <button onClick={handleLogoutClick} className={styles.logoutButton}>
        <span>Déconnexion</span>
        <IoArrowForward />
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Déconnexion"
        description="Êtes-vous sûr de vouloir vous déconnecter ?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
}
