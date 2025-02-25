import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode HTTP non autorisée, utilisez POST.",
    });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return res.status(500).json({ error: "URL de l'API non définie" });
  }

  try {
    const { login, new_password } = req.body;

    if (!login || !new_password || typeof new_password !== "string") {
      return res.status(400).json({ error: "Données invalides." });
    }

    const response = await fetch(`${apiUrl}/reset_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, new_password }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res.status(response.status).json({
        error:
          data.error || "Erreur lors de la réinitialisation du mot de passe.",
      });
    }
  } catch (error: any) {
    console.error(
      "Erreur lors de la requête à l'API distante :",
      error.message
    );
    return res.status(500).json({
      error: "Erreur interne lors de la réinitialisation du mot de passe.",
    });
  }
}
