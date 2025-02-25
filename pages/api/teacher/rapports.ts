import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token manquant ou non valide" });
  }

  if (req.method === "GET") {
    const { suiviId } = req.query;

    if (!suiviId) {
      return res
        .status(400)
        .json({ message: "ID du suivi requis pour cette requête" });
    }

    try {
      const response = await fetch(`${apiUrl}/get_rapports/${suiviId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message:
            data.message || "Erreur lors de la récupération des rapports",
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Erreur interne :", error);
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
  } else if (req.method === "POST") {
    try {
      const body = req.body;
      const response = await fetch(`${apiUrl}/add_rapport`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message: responseData.message || "Erreur lors de l'ajout du rapport",
        });
      }

      res.status(200).json({
        message: responseData.message || "Rapport ajouté avec succès",
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  } else {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }
}
