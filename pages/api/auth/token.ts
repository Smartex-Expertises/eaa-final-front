import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Récupérer le token d'une manière ou d'une autre. Cela dépend de ton système d'authentification.
  // Par exemple, tu peux le récupérer dans les cookies, localStorage, ou via une requête vers un autre endpoint.

  const token = req.cookies.token; // Exemple d'une récupération de token via les cookies

  if (!token) {
    return res.status(401).json({ message: "Token non trouvé" });
  }

  res.status(200).json({ token });
}
