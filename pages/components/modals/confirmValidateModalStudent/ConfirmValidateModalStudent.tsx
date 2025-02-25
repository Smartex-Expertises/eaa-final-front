import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./confirmvalidatemodalstudent.module.css";
import { IoClose } from "react-icons/io5";

interface ConfirmValidateModalStudentProps {
  onCancel: () => void;
  title?: string;
  message?: string;
  RapportId: number;
}

export default function ConfirmValidateModalStudent({
  onCancel,
  title = "Confirmation de lecture",
  message = "Après avoir lu, avez-vous des préoccupations ? Si oui, signalez-les. Sinon, indiquez 'RAS' (Rien À Signaler)",
  RapportId,
}: ConfirmValidateModalStudentProps) {
  const [concern, setConcern] = useState("");
  const [loading, setLoading] = useState(false);

  const handleValidateRapport = async (id: number) => {
    if (concern.trim() === "") {
      toast.error("Veuillez indiquer vos préoccupations ou écrire 'RAS'.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/student/rapports", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, concern }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const responseData = await response.json();
        toast.error(
          responseData.message || "Erreur lors de la validation du rapport."
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la validation du rapport.");
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" />
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.right}>
            <div></div>
            <button className={styles.btnClose} onClick={onCancel}>
              <IoClose />
            </button>
          </div>
          <h2>{title}</h2>
          <p>{message}</p>

          {/* Textarea for concerns */}
          <textarea
            placeholder="Écrivez vos préoccupations ici..."
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            rows={4}
            className={styles.textarea}
          />

          {loading ? (
            <p style={{ textAlign: "center" }}>Validation en cours...</p>
          ) : (
            <button
              onClick={() => handleValidateRapport(RapportId)}
              className={styles.confirmButton}
              disabled={loading}
            >
              Valider
            </button>
          )}
        </div>
      </div>
    </>
  );
}
