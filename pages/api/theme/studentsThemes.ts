import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }

  if (req.method === "GET") {
    try {
      const response = await fetch(`${apiUrl}/get_student_with_theme`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message: data.message || "Erreur lors de la récupération des thèmes.",
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Erreur interne :", error);
      return res.status(500).json({
        message: "Erreur interne du serveur lors de la récupération.",
      });
    }
  }

  // Si la méthode HTTP n'est pas GET
  return res.status(405).json({ message: "Méthode non autorisée." });
}
