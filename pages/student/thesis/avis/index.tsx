import React, { useEffect, useState } from "react";
import LayoutStudent from "@/layouts/student/LayoutStudent";
import styles from "./avis.module.css";

interface Avis {
  id_avis: number;
  id_suivi: number;
  id_expert:number;
  avis: string;
  created_at: string;
  updated_at: string;
}

export default function Avis() {
  const [loading, setLoading] = useState<boolean>(false);
  const [avisList, setAvisList] = useState<Avis[]>([]);

  useEffect(() => {
    const fetchAvis = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/student/avis", {
          method: "GET",
        });
        if (response.ok) {
          const data: Avis[] = await response.json();
          setAvisList(data);
        } else {
          console.error("Erreur lors de la récupération des avis");
        }
      } catch (error) {
        console.error("Une erreur est survenue", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvis();
  }, []);

  if (loading) {
    return <div style={{textAlign: "center"}}>Chargement...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Avis des experts</h2>
      {avisList.length > 0 ? (
        <div className={styles.avisList}>
          {avisList.map((avis) => (
            <div key={avis.id_avis} className={styles.alert}>
              <div className={styles.alertContent}>
                <p className={styles.timestamp}>
                  Date d&apos;émission : {new Date(avis.created_at).toLocaleString()}
                </p>
                <p>Avis : {avis.avis}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun avis trouvé.</p>
      )}
    </div>
  );
}

Avis.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutStudent>{page}</LayoutStudent>;
};
