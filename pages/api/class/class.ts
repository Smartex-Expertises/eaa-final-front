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

      const response = await fetch(`${apiUrl}/add_classe`, {
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
            responseData.message || "Erreur lors de l'ajout de la classe",
        });
      }

      res.status(200).json({
        message: responseData.message || "Classe ajoutée avec succès",
        classe: responseData.classe,
      });
    } catch (error) {
      res.status(500).json({ message: `Erreur interne du serveur ${error}` });
    }
  } else if (req.method === "GET") {
    try {
      const response = await fetch(`${apiUrl}/get_classes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message: data.message || "Erreur lors de la récupération des classes",
        });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: `Erreur interne du serveur ${error}` });
    }
  } else if (req.method === "DELETE") {
    const id_classe = req.body.id;
    if (!id_classe) {
      return res.status(400).json({ message: "L'ID de la classe est requis" });
    }

    try {
      const response = await fetch(`${apiUrl}/delete_classe/${id_classe}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        return res.status(200).json({
          message: responseData.message || "Classe supprimée avec succès",
        });
      } else {
        return res.status(500).json({
          message:
            responseData.message || "Échec de la suppression de la classe",
        });
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
