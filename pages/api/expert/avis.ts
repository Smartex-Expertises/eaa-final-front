import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = req.cookies.token;

  if (req.method === "POST") {
    try {
      const { idSuivi, avis } = req.body;
      const response = await fetch(`${apiUrl}/addAvisExpert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idSuivi, avis }),
      });

      if (response.ok) {
        const responseData = await response.json();
        res.status(200).json({
          message: responseData.message || "Avis envoyé avec succès !",
        });
      } else {
        const responseData = await response.json();
        res.status(response.status).json({
          message: responseData.message || "Erreur lors de l'envoi de l'avis",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Erreur interne du serveur ${error}`,
      });
    }
  } else {
    return res
      .status(405)
      .json({ error: `Méthode ${req.method} non autorisée` });
  }
}
