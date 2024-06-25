import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    const {idbot} = req.query;
    let prisma = new PrismaClient();
    const session = await getSession({ req });
    if (session) {

      try {
        const table = "gestures_" + idbot
        const results = await prisma.$queryRawUnsafe(`SELECT * FROM ${table};`)
        res.status(200).json({ results });
      } catch (error) {
        res.status(200).json({ error });
      }
      
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  }
