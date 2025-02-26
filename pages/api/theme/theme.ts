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

      const response = await fetch(`${apiUrl}/add_theme`, {
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
          message: responseData.message || "Erreur lors de l'ajout du thème",
        });
      }

      res.status(200).json({
        message: responseData.message || "Thème ajouté avec succès",
        theme: responseData.theme,
      });
    } catch (error) {
      res.status(500).json({ message: `Erreur interne du serveur ${error}` });
    }
  } else if (req.method === "GET") {
    try {
      const response = await fetch(`${apiUrl}/get_themes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message: data.message || "Erreur lors de la récupération des thèmes",
        });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: `Erreur interne du serveur ${error}` });
    }
  } else if (req.method === "DELETE") {
    const id_theme = req.body.id;
    if (!id_theme) {
      return res.status(400).json({ message: "L'ID du thème est requis" });
    }
    try {
      const response = await fetch(`${apiUrl}/delete_theme/${id_theme}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        return res.status(200).json({
          message: responseData.message || "Thème supprimé avec succès",
        });
      } else {
        return res.status(500).json({
          message: responseData.message || "Échec de la suppression du thème",
        });
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      return res.status(500).json({ message: `Erreur interne du serveur ${error}` });
    }
  } else if (req.method === "PUT") {
    const id_theme = req.body.id;
    if (!id_theme) {
      return res.status(400).json({ message: "L'ID du thème est requis" });
    }

    try {
      const response = await fetch(`${apiUrl}/valider_theme/${id_theme}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la validation du thème");
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: `Erreur interne du serveur ${error}`});
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
