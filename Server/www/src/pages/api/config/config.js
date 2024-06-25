import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (req.method === "POST") {
    if (session?.user) {
      const { RESTAPI, WS_URL } = process.env;

      try {
        res.status(200).json({ RESTAPI, WS_URL });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
