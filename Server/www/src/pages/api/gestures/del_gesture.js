import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const {idbot, idgesture} = req.body;
    let prisma = new PrismaClient();

      try {
        const table = "gestures_" + idbot
        const results = await prisma.$queryRawUnsafe(`DELETE FROM ${table} WHERE uuid = "${idgesture}";`)
        res.status(200).json({ results });
      } catch (error) {
        res.status(200).json({ error });
      }
    }
}
