import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      res.setHeader("Set-Cookie", [
        `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
        `type=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
        `premiere_connexion=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
      ]);

      return res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      return res.status(500).json({
        error: "Erreur interne du serveur lors de la déconnexion",
      });
    }
  } else {
    return res.status(405).json({
      error: `Méthode ${req.method} non autorisée`,
    });
  }
}
