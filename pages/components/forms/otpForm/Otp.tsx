import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoaderForm from "../../loaders/loaderForm/LoaderForm";
import Validate from "../../buttons/validate/Validate";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import styles from "../styles.module.css";
import stylesotp from "./otp.module.css";

const Otp: React.FC = () => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (value.length === 0 && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    const newOtp = [...inputsRef.current].map((input) => input?.value).join("");
    setOtp(newOtp);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 5) {
      setErrorMessage("Veuillez entrer un code OTP valide.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          router.push("/change-password");
        }
      } else {
        // Affiche directement le message retourné par Laravel
        setErrorMessage(data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setErrorMessage("Une erreur est survenue lors de la vérification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <form className={stylesotp.form} onSubmit={handleSubmit}>
          <span className={stylesotp.mainHeading}>Entrer OTP</span>
          <p>Première connexion détectée</p>
          <p className={stylesotp.otpSubheading}>
            Un code a été envoyé à votre adresse mail, il expire dans 3 minutes
          </p>
          <div className={stylesotp.inputContainer}>
            {[0, 1, 2, 3, 4].map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                required
                maxLength={1}
                type="text"
                className={stylesotp.otpInput}
                onChange={(e) => handleInput(e, index)}
              />
            ))}
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {isLoading ? (
            <LoaderForm />
          ) : (
            <Validate icon={<IoCheckmarkDoneSharp />} text="Vérifier" />
          )}
        </form>
      </div>
    </div>
  );
};

export default Otp;
