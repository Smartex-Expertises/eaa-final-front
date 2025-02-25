import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return res
        .status(500)
        .json({ error: "URL de l'API externe non configurée." });
    }

    try {
      const { login } = req.body;

      if (!login || typeof login !== "string") {
        return res
          .status(400)
          .json({ error: "Le champ login est requis et doit être valide." });
      }

      const response = await fetch(`${apiUrl}/generate_code_password_reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login }),
      });

      const data = await response.json();

      if (response.ok) {
        return res.status(200).json(data);
      } else {
        return res.status(response.status).json({
          error:
            data.message || "Erreur lors de la communication avec le serveur.",
        });
      }
    } catch (error) {
      console.error("Erreur interne :", error);
      return res.status(500).json({
        error: "Erreur interne lors de la communication avec l'API.",
      });
    }
  } else {
    return res
      .status(405)
      .json({ error: "Méthode non autorisée. Utilisez POST." });
  }
}
