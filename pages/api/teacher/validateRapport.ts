import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = req.cookies.token;

  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      const response = await fetch(`${apiUrl}/validation_encadrant`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const responseData = await response.json();
        res.status(200).json({
          message: responseData.message || "Rapport validé avec succès !",
        });
      } else {
        const responseData = await response.json();
        res.status(response.status).json({
          message:
            responseData.message || "Erreur lors de la validation du rapport.",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Une erreur est survenue lors de la validation du rapport.",
      });
    }
  } else {
    return res
      .status(405)
      .json({ error: `Méthode ${req.method} non autorisée` });
  }
}
