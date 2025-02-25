import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import LoaderUpload from "@/pages/components/loaders/loaderUpload/LoaderUpload";
import styles from "../../admin/fileupload.module.css";

interface UploadedFiles {
  finalMemory: File | null;
  apdFile: File | null;
}

export default function UploadFinalLicence() {
  const [finalFiles, setFinalFiles] = useState<UploadedFiles>({
    finalMemory: null,
    apdFile: null,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>("");

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const apiUrlRes = await fetch("/api/auth/getapiurl");
        const apiUrlData = await apiUrlRes.json();
        setApiUrl(apiUrlData.apiUrl);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'URL de l'API:",
          error
        );
      }
    };
    fetchApiUrl();
  }, []);

  const handleFinalFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof UploadedFiles
  ): void => {
    const file = e.target.files ? e.target.files[0] : null;
    setFinalFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleFinalSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const tokenRes = await fetch("/api/auth/token");
    const tokenData = await tokenRes.json();

    if (!tokenData.token) {
      console.error("Token d'authentification manquant");
      setError("Token d'authentification manquant");
      setLoading(false);
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
      const res = await fetch(`${apiUrl}/upload_final`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setSuccessMessage("Fichiers téléchargés avec succès!");
        window.location.reload();
      } else {
        setError("Une erreur s'est produite lors de l'envoi des fichiers.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des fichiers", error);
      setError("Une erreur s'est produite lors de l'envoi des fichiers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFinalSubmit} className={styles.form}>
        <h2>Final</h2>

        {/* Bouton pour télécharger le fichier finalMemory */}
        <button type="button" className={styles.containerBtnFile}>
          <svg
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 50 50"
          >
            <path d="..."></path>
          </svg>
          {finalFiles.finalMemory
            ? finalFiles.finalMemory.name
            : "Mémoire final"}
          <input
            className={styles.fileInput}
            type="file"
            name="file"
            accept=".pdf"
            onChange={(e) => handleFinalFileChange(e, "finalMemory")}
          />
        </button>

        {/* Bouton pour télécharger le fichier apdFile */}
        <button type="button" className={styles.containerBtnFile}>
          <svg
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 50 50"
          >
            <path d="..."></path>
          </svg>
          {finalFiles.apdFile
            ? finalFiles.apdFile.name
            : "Avant projet détaillé"}
          <input
            className={styles.fileInput}
            type="file"
            name="file"
            accept=".pdf"
            onChange={(e) => handleFinalFileChange(e, "apdFile")}
          />
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <button type="submit" className={styles.button}>
          <svg
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
          <span className={styles.text}>Lancer</span>
        </button>
      </form>
      {isLoading && <LoaderUpload />}
    </>
  );
}
