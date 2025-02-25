import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const cookies = req.headers.cookie;

      if (!cookies) {
        res.status(404).json({ error: "Aucun cookie trouvé" });
        return;
      }

      const parseCookies = (cookieString: string): Record<string, string> => {
        return cookieString
          .split(";")
          .reduce((acc: Record<string, string>, cookie: string) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = decodeURIComponent(value || "");
            return acc;
          }, {});
      };

      const parsedCookies = parseCookies(cookies);

      const login = parsedCookies.login;

      if (!login) {
        res.status(404).json({ error: "Cookie 'login' non trouvé" });
        return;
      }

      const otp = req.body.otp;

      const response = await fetch(`${apiUrl}/verify_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          otp: otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        res.status(response.status).json({
          success: false,
          message: errorData.message || "Une erreur inconnue est survenue.",
        });
        return;
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du cookie:", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération du cookie" });
    }
  } else {
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}
