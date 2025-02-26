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

      const response = await fetch(`${apiUrl}/create_account_student`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData.message || "Erreur lors de l'ajout de l'étudiant";
        return res.status(response.status).json({
          message: errorMessage,
        });
      }

      res.status(200).json({
        message: responseData.message || "Etudiant ajouté avec succès",
      });
    } catch (error) {
      res.status(500).json({ message: `Erreur interne du serveur ${error}` });
    }
  } else if (req.method === "GET") {
    try {
      const response = await fetch(`${apiUrl}/get_students`, {
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
            data.message || "Erreur lors de la récupération des étudiants",
        });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: `Erreur interne du serveur ${error}`  });
    }
  } else {
    return res
      .status(405)
      .json({ error: `Méthode ${req.method} non autorisée` });
  }
}
