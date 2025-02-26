import React from "react";
import styles from "./themeslist.module.css";

type Theme = {
  id_theme: number;
  theme: string;
  status: number;
};

type ThemesListProps = {
  themes: Theme[];
  onValidateTheme: (id_theme: number) => void; // Fonction pour valider un thème
};

const ThemesList: React.FC<ThemesListProps> = ({ themes, onValidateTheme }) => {
  return (
    <div className={styles.container}>
      {themes && themes.length > 0 ? (
        <div>
          {themes.map((theme) => (
            <React.Fragment key={theme.id_theme}>
              <div className={styles.theme}>
                <div>{theme.theme}</div>
                <div>
                  {theme.status === 0 ? (
                    <button
                      className={styles.validateButton}
                      onClick={() => onValidateTheme(theme.id_theme)}
                    >
                      Valider le thème
                    </button>
                  ) : (
                    <div>Thème validé</div>
                  )}
                </div>
              </div>
              <hr />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p className={styles.noTheme}>Aucun thème proposé.</p>
      )}
    </div>
  );
};

export default ThemesList;
