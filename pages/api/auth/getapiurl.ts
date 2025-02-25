import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  res.status(200).json({ apiUrl });
}
