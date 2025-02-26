import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return res.status(500).json({ error: "URL de l'API non définie" });
    }

    try {
      const body = req.body;
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.error || "Erreur d'authentification",
        });
      }

      const { token, type, premiere_connexion } = data;

      // Définir les cookies
      const cookies = [];
      if (premiere_connexion) {
        cookies.push(
          `login=${req.body.login}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
        );
      } else {
        cookies.push(
          `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
          `type=${type}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
        );
      }

      res.setHeader("Set-Cookie", cookies);

      return res.status(200).json({ type, premiere_connexion });
    } catch (error) {
      console.error("Erreur :", error);
      return res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  } else {
    return res.status(405).json({
      error: `Méthode ${req.method} non autorisée`,
    });
  }
}
