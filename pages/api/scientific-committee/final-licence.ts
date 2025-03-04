import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = req.cookies.token;

  if (req.method === "PUT") {
    const id_fichier_licence = req.body.id_fichier_licence;
    if (!id_fichier_licence) {
      return res
        .status(400)
        .json({ message: "L'ID du fichier de licence est requis" });
    }

    try {
      const response = await fetch(
        `${apiUrl}/validation_finale_licence/${id_fichier_licence}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la validation du fichier de licence");
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        message:
         `Erreur interne du serveur ${error}`
      });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
