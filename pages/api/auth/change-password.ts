import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Récupérer les cookies depuis l'en-tête
      const cookies = req.headers.cookie;

      // Vérifier si des cookies existent
      if (!cookies) {
        res.status(404).json({ error: "Aucun cookie trouvé" });
        return;
      }

      // Fonction pour parser les cookies
      const parseCookies = (cookieString: string): Record<string, string> => {
        return cookieString
          .split(";")
          .reduce((acc: Record<string, string>, cookie: string) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = decodeURIComponent(value || "");
            return acc;
          }, {});
      };

      // Parsing des cookies
      const parsedCookies = parseCookies(cookies);

      // Récupérer la valeur du cookie "login"
      const login = parsedCookies.login;

      if (!login) {
        res.status(404).json({ error: "Cookie 'login' non trouvé" });
        return;
      }

      // Vérifier la présence des champs nécessaires dans le body
      const { confirmPassword } = req.body;
      if (!confirmPassword) {
        res
          .status(400)
          .json({ error: "Le champ 'confirmPassword' est requis" });
        return;
      }

      // Envoyer une requête à l'API backend pour changer le mot de passe
      const response = await fetch(`${apiUrl}/change_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          password: confirmPassword,
        }),
      });

      // Gestion de la réponse du backend
      if (!response.ok) {
        const errorData = await response.json();
        res
          .status(response.status)
          .json({ error: errorData.error || "Erreur inconnue côté serveur" });
        return;
      }

      const data = await response.json();

      // Supprimer tous les cookies en envoyant un cookie expiré
      res.setHeader("Set-Cookie", [
        `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
        `type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
        `premiere_connexion=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
        `login=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
      ]);

      // Retourner la réponse du backend après avoir supprimé les cookies
      res.status(200).json(data);
    } catch (error) {
      console.error("Erreur lors du traitement de la requête :", error);
      res
        .status(500)
        .json({ error: "Erreur interne lors du traitement de la requête" });
    }
  } else {
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}
