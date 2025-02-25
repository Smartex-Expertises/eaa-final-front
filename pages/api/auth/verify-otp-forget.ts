import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return res.status(500).json({ error: "URL de l'API non définie" });
    }

    try {
      const body = req.body;

      const response = await fetch(`${apiUrl}/verify_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        return res.status(200).json(data);
      } else {
        return res
          .status(response.status)
          .json({
            error: data.error || "Erreur lors de la validation de l'OTP.",
          });
      }
    } catch (error) {
      console.error("Erreur lors de la requête à l'API distante :", error);
      return res
        .status(500)
        .json({ error: "Erreur interne lors de la validation de l'OTP." });
    }
  } else {
    return res.status(405).json({
      error: "Méthode HTTP non autorisée, utilisez POST.",
    });
  }
}
