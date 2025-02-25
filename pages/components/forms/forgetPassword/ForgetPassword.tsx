import React, { useState } from "react";
import styles from "../styles.module.css";
import { IoReload, IoLogIn, IoCheckmarkDoneSharp } from "react-icons/io5";
import Validate from "../../buttons/validate/Validate";
import LoaderForm from "../../loaders/loaderForm/LoaderForm";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  // États pour les étapes
  const [step, setStep] = useState<number>(1); // Étape actuelle
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // États pour les champs
  const [login, setLogin] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // États pour les erreurs
  const [errors, setErrors] = useState<{
    login?: string;
    otp?: string;
    password?: string;
  }>({});
  const [errorPassword, setErrorPassword] = useState("");

  const handleLoginChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLogin = e.target.value;
    setLogin(newLogin);
    setErrors((prev) => ({ ...prev, login: "" }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setErrorPassword("Le mot de passe doit contenir au moins 8 caractères.");
    } else {
      setErrorPassword("");
    }
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!login.trim()) {
      setErrors({ login: "Le login est requis." });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP généré avec succès :", data.message);
        setStep(2);
      } else {
        setErrors({
          login: data.error || "Erreur lors de la génération de l'OTP.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la requête OTP :", error);
      setErrors({ login: "Une erreur inattendue est survenue." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    if (!/^\d{5}$/.test(otp.trim())) {
      setErrors({ otp: "Le code OTP doit être un nombre à 5 chiffres." });
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp-forget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, otp }),
      });

      if (response.ok) {
        setStep(3);
      } else {
        const errorData = await response.json();
        setErrors({
          otp:
            errorData.error ||
            "Erreur inconnue lors de la vérification de l'OTP.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'OTP :", error);
      setErrors({ otp: "Erreur interne, veuillez réessayer plus tard." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    setErrorPassword("");

    if (!password.trim()) {
      setErrors({ password: "Le mot de passe est requis." });
      return;
    }
    if (password.length < 8) {
      setErrors({
        password: "Le mot de passe doit contenir au moins 8 caractères.",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          new_password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Mot de passe réinitialisé avec succès !");
        setLogin("");
        setOtp("");
        setPassword("");
        router.push("/");
      } else {
        setErrors({ password: data.error || "Une erreur est survenue." });
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error);
      setErrors({ password: "Erreur interne, veuillez réessayer plus tard." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        {step === 1 && (
          <form
            className={styles.loginForm}
            onSubmit={handleLoginSubmit}
            style={{
              backgroundColor: "#fff",
              padding: "3rem",
              borderRadius: "5px",
            }}
          >
            <div className={styles.formGroup}>
              <h3>Etape 1/3</h3>
              <label htmlFor="login">Entrez votre login (email)</label>
              <input
                type="text"
                id="login"
                value={login}
                onChange={handleLoginChange}
                className={errors.login ? styles.inputError : ""}
                style={{ textAlign: "center" }}
              />
              {errors.login && <p className={styles.error}>{errors.login}</p>}
            </div>
            <div>
              {isLoading ? (
                <LoaderForm />
              ) : (
                <Validate icon={<IoLogIn />} text="Envoyer l'OTP" />
              )}
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            className={styles.loginForm}
            onSubmit={handleOtpSubmit}
            style={{
              backgroundColor: "#fff",
              padding: "3rem",
              borderRadius: "5px",
            }}
          >
            <div className={styles.formGroup}>
              <h3>Etape 2/3</h3>
              <label htmlFor="otp">Entrez le code reçu sur votre mail</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                className={errors.otp ? styles.inputError : ""}
                style={{ textAlign: "center" }}
                maxLength={5}
              />
              {errors.otp && <p className={styles.error}>{errors.otp}</p>}
            </div>
            <div>
              {isLoading ? (
                <LoaderForm />
              ) : (
                <Validate
                  icon={<IoCheckmarkDoneSharp />}
                  text="Valider l'OTP"
                />
              )}
            </div>
          </form>
        )}

        {step === 3 && (
          <form
            className={styles.loginForm}
            onSubmit={handlePasswordSubmit}
            style={{
              backgroundColor: "#fff",
              padding: "3rem",
              borderRadius: "5px",
            }}
          >
            <div className={styles.formGroup}>
              <h3>Etape 3/3</h3>
              <label htmlFor="password">
                Choisissez un nouveau mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={
                  errorPassword || errors.password ? styles.inputError : ""
                }
                style={{ textAlign: "center" }}
              />
              {errorPassword && <p className={styles.error}>{errorPassword}</p>}
              {errors.password && (
                <p className={styles.error}>{errors.password}</p>
              )}
            </div>
            <div>
              {isLoading ? (
                <LoaderForm />
              ) : (
                <Validate
                  icon={<IoReload />}
                  text="Réinitialiser le mot de passe"
                />
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
