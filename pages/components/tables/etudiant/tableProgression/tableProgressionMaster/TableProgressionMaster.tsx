import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "../tableprogression.module.css";

type Seance = {
  id_auteur: number | null;
  seance: number;
  date: string | null;
  validation_etudiant: number;
  validation_encadrant: number;
};

type FichiersSuivi = {
  memoire_analytique?: string | null;
  dossier_esquisse?: string | null;
  validation_mis_parcours?: number;
  memoire_final: string | null;
  apd: string | null;
  validation_finale: number;
};

type TableProgressionProps = {
  seances: Seance[];
  fichiers: FichiersSuivi | null;
};

interface UploadedFiles {
  memory: File | null;
  sketchFile: File | null;
}

interface FinalFiles {
  finalMemory: File | null;
  apdFile: File | null;
}

const TableProgressionMaster: React.FC<TableProgressionProps> = ({
  seances,
  fichiers,
}) => {
  const [loading, setLoading] = useState(false);
  const [misParcoursFiles, setMisParcoursFiles] = useState<UploadedFiles>({
    memory: null,
    sketchFile: null,
  });

  const [finalFiles, setFinalFiles] = useState<FinalFiles>({
    finalMemory: null,
    apdFile: null,
  });

  const misParcoursSubmitted = false;
  const finalSubmitted = false;

  const handleMisParcoursFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof UploadedFiles
  ): void => {
    const file = e.target.files ? e.target.files[0] : null;
    setMisParcoursFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleFinalFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof FinalFiles
  ): void => {
    const file = e.target.files ? e.target.files[0] : null;
    setFinalFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleMisParcoursSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const tokenRes = await fetch("/api/auth/token");
    const tokenData = await tokenRes.json();

    if (!tokenData.token) {
      console.error("Token d'authentification manquant");
      return;
    }

    const formData = new FormData();
    if (misParcoursFiles.memory) {
      formData.append("memory", misParcoursFiles.memory);
    }
    if (misParcoursFiles.sketchFile) {
      formData.append("sketchFile", misParcoursFiles.sketchFile);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload_mis_parcours", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: formData,
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des fichiers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const tokenRes = await fetch("/api/auth/token");
    const tokenData = await tokenRes.json();

    if (!tokenData.token) {
      console.error("Token d'authentification manquant");
      return;
    }

    const formData = new FormData();
    if (finalFiles.finalMemory) {
      formData.append("finalMemory", finalFiles.finalMemory);
    }
    if (finalFiles.apdFile) {
      formData.append("apdFile", finalFiles.apdFile);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload_final", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: formData,
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des fichiers", error);
    } finally {
      setLoading(false);
    }
  };

  const getSessionStatus = (session: Seance) => {
    if (session.id_auteur === null) {
      return "Non effectuée";
    } else if (session.validation_etudiant === 0) {
      return "En attente de lecture";
    } else {
      return "Effectuée";
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "Effectuée":
        return styles.done;
      case "En attente de lecture":
        return styles.awaitingValidation;
      default:
        return styles.notDone;
    }
  };

  return (
    <div className={styles.tableProgression}>
      <div className={styles.sessionsRow}>
        {seances && seances.slice(0, 6).map((session, index) => {
          const status = getSessionStatus(session);
          return (
            <div className={styles.session} key={index}>
              <div className={styles.sessionHeader}>
                <h4>{`Séance ${session.seance}`}</h4>
                {session.date && <span>{session.date}</span>}
              </div>
              <div
                className={`${styles.sessionStatus} ${getStatusClass(status)}`}
              >
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {(!fichiers?.memoire_analytique || !fichiers?.dossier_esquisse) && (
        <form
          onSubmit={handleMisParcoursSubmit}
          className={styles.formSection}
          style={{
            opacity: seances
              .slice(0, 6)
              .every((session) => getSessionStatus(session) === "Effectuée")
              ? 1
              : 0.5,
            pointerEvents:
              seances
                .slice(0, 6)
                .every(
                  (session) => getSessionStatus(session) === "Effectuée"
                ) && !misParcoursSubmitted
                ? "auto"
                : "none",
          }}
        >
          <div className={styles.inputSection}>
            <h3>Partie analytique (intermédiaire)</h3>
            <div className={styles.row}>
              <div className={`${styles.inputGroup} ${styles.col}`}>
                <label>Mémoire analytique</label>
                <input
                  type="file"
                  className={styles.sessionInput}
                  onChange={(e) => handleMisParcoursFileChange(e, "memory")}
                  disabled={
                    !seances
                      .slice(0, 6)
                      .every(
                        (session) => getSessionStatus(session) === "Effectuée"
                      ) || misParcoursSubmitted
                  }
                  accept=".pdf"
                />
                {misParcoursFiles.memory && (
                  <span>{misParcoursFiles.memory.name}</span>
                )}
              </div>

              <div className={`${styles.inputGroup} ${styles.col}`}>
                <label>Dossier esquisse</label>
                <input
                  type="file"
                  className={styles.sessionInput}
                  onChange={(e) => handleMisParcoursFileChange(e, "sketchFile")}
                  disabled={
                    !seances
                      .slice(0, 6)
                      .every(
                        (session) => getSessionStatus(session) === "Effectuée"
                      ) || misParcoursSubmitted
                  }
                  accept=".pdf"
                />
                {misParcoursFiles.sketchFile && (
                  <span>{misParcoursFiles.sketchFile.name}</span>
                )}
              </div>
            </div>
          </div>
          {loading ? (
            <div>Envoi en cours...</div>
          ) : (
            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                !seances
                  .slice(0, 6)
                  .every(
                    (session) => getSessionStatus(session) === "Effectuée"
                  ) || misParcoursSubmitted
              }
            >
              Soumettre
            </button>
          )}
        </form>
      )}

      {fichiers?.memoire_analytique &&
        fichiers?.dossier_esquisse &&
        fichiers?.validation_mis_parcours === 0 && (
          <div className={styles.pending}>
            <a
              href={`http://127.0.0.1:8000${fichiers.memoire_analytique}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Voir Mémoire analytique
            </a>
            <a
              href={`http://127.0.0.1:8000${fichiers.dossier_esquisse}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Voir Dossier esquisse
            </a>
            <h4 className={styles.textPending}>En attente de validation</h4>
            <div className={styles.loader}></div>
          </div>
        )}

      {fichiers?.validation_mis_parcours === 1 && (
        <div className={styles.pending}>
          <a
            href={`http://127.0.0.1:8000${fichiers.memoire_analytique}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Mémoire analytique
          </a>
          <a
            href={`http://127.0.0.1:8000${fichiers.dossier_esquisse}`}
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

      <div className={styles.sessionsRow}>
        {seances.slice(6, 12).map((session, index) => {
          const status = getSessionStatus(session);
          return (
            <div className={styles.session} key={index}>
              <div className={styles.sessionHeader}>
                <h4>{`Séance ${session.seance}`}</h4>
                {session.date && <span>{session.date}</span>}
              </div>
              <div
                className={`${styles.sessionStatus} ${getStatusClass(status)}`}
              >
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {(!fichiers?.memoire_final || !fichiers?.apd) && (
        <form
          onSubmit={handleFinalSubmit}
          style={{
            opacity: seances
              .slice(0, 12)
              .every((session) => getSessionStatus(session) === "Effectuée")
              ? 1
              : 0.5,
            pointerEvents: seances
              .slice(0, 12)
              .every((session) => getSessionStatus(session) === "Effectuée")
              ? "auto"
              : "none",
          }}
        >
          <div className={styles.inputSection}>
            <h3>Partie architecturale (final)</h3>
            <div className={styles.row}>
              <div className={`${styles.inputGroup} ${styles.col}`}>
                <label>Upload partie mémoire</label>
                <input
                  type="file"
                  className={styles.sessionInput}
                  onChange={(e) => handleFinalFileChange(e, "finalMemory")}
                  disabled={
                    !seances
                      .slice(0, 12)
                      .every(
                        (session) => getSessionStatus(session) === "Effectuée"
                      ) || finalSubmitted
                  }
                  accept=".pdf"
                />
                {finalFiles.finalMemory && (
                  <span>{finalFiles.finalMemory.name}</span>
                )}
              </div>

              <div className={`${styles.inputGroup} ${styles.col}`}>
                <label>Upload APD</label>
                <input
                  type="file"
                  className={styles.sessionInput}
                  onChange={(e) => handleFinalFileChange(e, "apdFile")}
                  disabled={
                    !seances
                      .slice(0, 12)
                      .every(
                        (session) => getSessionStatus(session) === "Effectuée"
                      ) || finalSubmitted
                  }
                  accept=".pdf"
                />
                {finalFiles.apdFile && <span>{finalFiles.apdFile.name}</span>}
              </div>
            </div>
          </div>
          {loading ? (
            <div>Envoi en cours...</div>
          ) : (
            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                !seances
                  .slice(0, 12)
                  .every(
                    (session) =>
                      getSessionStatus(session) === "Effectuée" ||
                      getSessionStatus(session) === "En attente de lecture"
                  ) || finalSubmitted
              }
            >
              Soumettre
            </button>
          )}
        </form>
      )}

      {fichiers?.memoire_final &&
        fichiers?.apd &&
        fichiers?.validation_finale === 0 && (
          <div className={styles.pending}>
            <a
              href={`http://127.0.0.1:8000${fichiers.memoire_final}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Mémoire final
            </a>
            <a
              href={`http://127.0.0.1:8000${fichiers.apd}`}
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
        )}

      {fichiers?.validation_finale === 1 && (
        <div className={styles.pending}>
          <a
            href={`http://127.0.0.1:8000${fichiers.memoire_final}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Mémoire final
          </a>
          <a
            href={`http://127.0.0.1:8000${fichiers.apd}`}
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
      )}
    </div>
  );
};

export default TableProgressionMaster;
