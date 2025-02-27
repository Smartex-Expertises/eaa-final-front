import React from "react";
import styles from "./tableprogression.module.css";

interface Rapport {
  id_rapport: number;
  id_suivi: number;
  id_auteur: number;
  seance: number;
  date: string | null;
  heure: string | null;
  objectifs_seance: string | null;
  taches_effectuees: string | null;
  duree_seance: string | null;
  taches_prochaine_seance: string | null;
  validation_etudiant: number;
  validation_encadrant: number;
  created_at: string;
  updated_at: string;
}

interface TableProgressionProps {
  fichierMaNEXT_PUBLIC_API_URLster: {
    memoire_analytique: string | null;
    dossier_esquisse: string | null;
    validation_mis_parcours: number;
    memoire_final: string | null;
    apd: string | null;
    validation_finale: number;
  } | null;
  fichierLicence: {
    memoire_final: string;
    apd: string;
    validation_finale: number;
  } | null;
  typeSuivi: string;
  rapports: Rapport[];
}

const TableProgression: React.FC<TableProgressionProps> = ({
  fichierMaster,
  fichierLicence,
  typeSuivi,
  rapports = [],
}) => {

  const apiUrl = process.env.NEXT_PUBLIC_URL;
  const getStatusClassMaster = (status: string): string => {
    switch (status) {
      case "Effectuée":
        return styles.done;
      case "En attente de lecture":
        return styles.awaitingValidation;
      default:
        return styles.notDone;
    }
  };

  

  const getStatusClassLicence = (status: string): string => {
    switch (status) {
      case "Effectuée":
        return styles.done;
      case "En attente de lecture":
        return styles.awaitingValidation;
      default:
        return styles.notDone;
    }
  };

  const getSessionStatusMaster = (session: Rapport): string => {
    if (session.id_auteur === null) {
      return "Non effectuée";
    } else if (session.validation_etudiant === 0) {
      return "En attente de lecture";
    } else {
      return "Effectuée";
    }
  };

  const getSessionStatusLicence = (session: Rapport): string => {
    if (session.id_auteur === null) {
      return "Non effectuée";
    } else if (session.validation_etudiant === 0) {
      return "En attente de lecture";
    } else {
      return "Effectuée";
    }
  };

  return (
    <div className={styles.tableProgression}>
      <div className={styles.sessionsRow}>
        {rapports && rapports.slice(0, 6).map((session, index) => (
          <div className={styles.session} key={index}>
            <div className={styles.sessionHeader}>
              <h4>{`Séance ${session.seance}`}</h4>
              {session.date && <span>{session.date}</span>}
            </div>
            <div
              className={`${styles.sessionStatus} ${
                typeSuivi === "Licence"
                  ? getStatusClassLicence(
                      getSessionStatusLicence(session as Rapport)
                    )
                  : getStatusClassMaster(
                      getSessionStatusMaster(session as Rapport)
                    )
              }`}
            >
              {typeSuivi === "Licence"
                ? getSessionStatusLicence(session as Rapport)
                : getSessionStatusMaster(session as Rapport)}
            </div>
          </div>
        ))}
      </div>

      {typeSuivi === "Master" &&
        (!fichierMaster?.memoire_analytique ||
        !fichierMaster?.dossier_esquisse ? (
          rapports
            .slice(0, 6)
            .every(
              (session) => getSessionStatusMaster(session) === "Effectuée"
            ) ? (
            <div className={styles.pending}>
              <h4 className={styles.textPending}>
                En attente de l&apos;upload à mis parcours
              </h4>
            </div>
          ) : (
            <div className={styles.pending}>
              <h4 className={styles.notDone}>
                Les 6 séances ne sont pas encore effectuées
              </h4>
            </div>
          )
        ) : (
          <>
            {fichierMaster?.memoire_analytique &&
              fichierMaster?.dossier_esquisse &&
              fichierMaster?.validation_mis_parcours === 0 && (
                <div className={styles.pending}>
                  <a
                    href={`${apiUrl}${fichierMaster.memoire_analytique}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Voir Mémoire analytique
                  </a>
                  <a
                    href={`${apiUrl}${fichierMaster.dossier_esquisse}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Voir Dossier esquisse
                  </a>
                  <h4 className={styles.textPending}>
                    En attente de validation
                  </h4>
                  <div className={styles.loader}></div>
                </div>
              )}

            {fichierMaster?.validation_mis_parcours === 1 && (
              <div className={styles.pending}>
                <a
                  href={`${apiUrl}${fichierMaster.memoire_analytique}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Mémoire analytique
                </a>
                <a
                  href={`${apiUrl}${fichierMaster.dossier_esquisse}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Dossier esquisse
                </a>
                <h4 className={styles.textCongrate}>
                  🎉 Mis parcours validé, autorisation de poursuite.
                </h4>
              </div>
            )}
          </>
        ))}

      <div className={styles.sessionsRow}>
        {rapports && rapports.slice(6, 12).map((session, index) => (
          <div className={styles.session} key={index}>
            <div className={styles.sessionHeader}>
              <h4>{`Séance ${session.seance}`}</h4>
              {session.date && <span>{session.date}</span>}
            </div>
            <div
              className={`${styles.sessionStatus} ${
                typeSuivi === "Licence"
                  ? getStatusClassLicence(
                      getSessionStatusLicence(session as Rapport)
                    )
                  : getStatusClassMaster(
                      getSessionStatusMaster(session as Rapport)
                    )
              }`}
            >
              {typeSuivi === "Licence"
                ? getSessionStatusLicence(session as Rapport)
                : getSessionStatusMaster(session as Rapport)}
            </div>
          </div>
        ))}
      </div>

      {typeSuivi === "Licence" ? (
        !fichierLicence?.memoire_final || !fichierLicence?.apd ? (
          rapports
            .slice(6, 12)
            .every(
              (session) => getSessionStatusMaster(session) === "Effectuée"
            ) ? (
            <div className={styles.pending}>
              <h4 className={styles.textPending}>
                En attente de l&apos;upload à final
              </h4>
            </div>
          ) : (
            <div className={styles.pending}>
              <h4 className={styles.notDone}>
                Les 12 séances ne sont pas encore effectuées
              </h4>
            </div>
          )
        ) : fichierLicence?.memoire_final &&
          fichierLicence?.apd &&
          fichierLicence?.validation_finale === 0 ? (
          <div className={styles.pending}>
            <a
              href={`${apiUrl}${fichierLicence.memoire_final}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Mémoire final
            </a>
            <a
              href={`${apiUrl}${fichierLicence.apd}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              APD
            </a>
            <h4 className={styles.textPending}>
              En attente de validation finale
            </h4>
            <div className={styles.loader}></div>
          </div>
        ) : fichierLicence?.validation_finale === 1 ? (
          <div className={styles.pending}>
            <a
              href={`${apiUrl}${fichierLicence.memoire_final}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Mémoire final
            </a>
            <a
              href={`${apiUrl}${fichierLicence.apd}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              APD
            </a>
            <h4 className={styles.textCongrate}>
              🎉 Validation finale réussie, autorisation de soutenir.
            </h4>
          </div>
        ) : null
      ) : !fichierMaster?.memoire_final || !fichierMaster?.apd ? (
        rapports
          .slice(6, 12)
          .every(
            (session) => getSessionStatusMaster(session) === "Effectuée"
          ) ? (
          <div className={styles.pending}>
            <h4 className={styles.textPending}>
              En attente de l&apos;upload à mis parcours
            </h4>
          </div>
        ) : (
          <div className={styles.pending}>
            <h4 className={styles.notDone}>
              Les 12 séances ne sont pas encore effectuées
            </h4>
          </div>
        )
      ) : fichierMaster?.memoire_final &&
        fichierMaster?.apd &&
        fichierMaster?.validation_finale === 0 ? (
        <div className={styles.pending}>
          <a
            href={`${apiUrl}${fichierMaster.memoire_final}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Mémoire final
          </a>
          <a
            href={`${apiUrl}${fichierMaster.apd}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            APD
          </a>
          <h4 className={styles.textPending}>
            En attente de validation finale
          </h4>
          <div className={styles.loader}></div>
        </div>
      ) : fichierMaster?.validation_finale === 1 ? (
        <div className={styles.pending}>
          <a
            href={`${apiUrl}${fichierMaster.memoire_final}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Mémoire final
          </a>
          <a
            href={`${apiUrl}${fichierMaster.apd}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            APD
          </a>
          <h4 className={styles.textCongrate}>
            🎉 Validation finale réussie, autorisation de soutenir.
          </h4>
        </div>
      ) : null}
    </div>
  );
};

export default TableProgression;
