import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles.module.css";
import styleslogin from "./styleslogin.module.css";
import Validate from "../../buttons/validate/Validate";
import LoaderForm from "../../loaders/loaderForm/LoaderForm";
import { IoLogIn } from "react-icons/io5";
import { Typewriter } from "react-simple-typewriter";
import { useRouter } from "next/navigation";

export default function Login() {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ login: string; password: string }>({
    login: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateLogin = (login: string): string => {
    if (login.trim().length === 0) {
      return "Veuillez entrer un identifiant valide.";
    }
    return "";
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");

    let formIsValid = true;
    const newErrors = { login: "", password: "" };

    if (!login) {
      newErrors.login = "L'identifiant est obligatoire.";
      formIsValid = false;
    } else if (validateLogin(login)) {
      newErrors.login = validateLogin(login);
      formIsValid = false;
    }

    if (!password) {
      newErrors.password = "Le mot de passe est obligatoire.";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrors({
            login: errorData.login || "",
            password: errorData.password || "",
          });
          setGeneralError("Login ou mot de passe incorrect.");
          return;
        }
        const user = await response.json();

        if (user.premiere_connexion) {
          router.push("/verification");
        } else {
          if (user.type === "admin") {
            router.push("/admin");
          } else if (user.type === "etudiant") {
            router.push("/student");
          } else if (user.type === "enseignant") {
            router.push("/teacher");
          } else if (user.type === "parent") {
            router.push("/parent");
          } else if (user.type === "expert") {
            router.push("/expert");
          }else if (user.type === "ResponsableProgramme") {
            router.push("/program-manager");
          } else if (user.type === "CommiteScientifique") {
            router.push("/scientific-committee");
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
    if (errors.login) {
      setErrors((prevErrors) => ({ ...prevErrors, login: "" }));
    }
    setGeneralError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
    setGeneralError("");
  };

  return (
    <div className={styles.background}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <div className={styleslogin.form}>
          <div className={styleslogin.welcome}>
            <h1>
              <Typewriter
                words={["Bienvenue"]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={140}
                deleteSpeed={100}
                delaySpeed={2000}
              />
            </h1>
            <p>
              <span>Connectez-vous à votre espace...</span>
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="login">Login</label>
              <input
                type="text"
                id="login"
                name="login"
                value={login}
                onChange={handleLoginChange}
              />
              {errors.login && <p className={styles.error}>{errors.login}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password}</p>
              )}
            </div>
            {generalError && (
              <p className={styles.loginError}>{generalError}</p>
            )}
            <div className={styleslogin.centerContainer}>
              {isLoading ? (
                <LoaderForm />
              ) : (
                <Validate icon={<IoLogIn />} text="Se connecter" />
              )}
            </div>
            <p className={styleslogin.forgotPassword}>
              <Link href="forget-password">Mot de passe oublié</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
