import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = req.cookies.token;

  if (req.method === "GET") {
    try {
      const response = await fetch(`${apiUrl}/get_suivi_teacher_licence`, {
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
            data.message || "Erreur lors de la récupération des suivis",
        });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
}
