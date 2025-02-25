import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = req.cookies.token;

  if (req.method === "POST") {
    try {
      const body = req.body;

      const response = await fetch(`${apiUrl}/encadrements/addExpertEtudiant`, {
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
          message:
            responseData.message || "Erreur lors de l'ajout de la relation",
        });
      }

      res.status(200).json({
        message: responseData.message || "Relation ajoutée avec succès",
        classe: responseData.classe,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  } else if (req.method === "GET") {
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
