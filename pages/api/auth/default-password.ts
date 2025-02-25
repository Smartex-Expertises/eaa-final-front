import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = req.cookies.token;

  if (req.method === "PUT") {
    try {
      const body = req.body;
      const response = await fetch(`${apiUrl}/update_default_password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des données");
      }

      res.status(200).json({ message: "Mise à jour réussie" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  } else if (req.method === "GET") {
    try {
      const response = await fetch(`${apiUrl}/get_default_password`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des données" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
