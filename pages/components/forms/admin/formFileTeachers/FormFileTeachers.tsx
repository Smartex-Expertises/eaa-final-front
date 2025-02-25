import React, { useState } from "react";
import LoaderUpload from "@/pages/components/loaders/loaderUpload/LoaderUpload";
import styles from "../fileupload.module.css";

export default function FormFileTeachers() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/teachers/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi du fichier.");
      }

      const data = await response.json();
      setSuccessMessage("Fichier importé avec succès !");
      console.log("Réponse serveur:", data);
    } catch (err) {
      console.error(err);
      setError("Une erreur s'est produite lors de l'importation du fichier.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
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
          {file ? file.name : "Cliquez pour choisir le fichier Excel"}
          <input
            className={styles.fileInput}
            type="file"
            name="file"
            accept=".xlsx"
            onChange={handleFileChange}
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
      {isLoading ? <LoaderUpload /> : null}
    </div>
  );
}
