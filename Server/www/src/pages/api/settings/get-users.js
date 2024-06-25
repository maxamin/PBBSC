import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    let prisma = new PrismaClient();
    const session = await getSession({ req });
    if (session) {
      const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            role: true,
            tag: true,
            permissions: true
        }
    });
  
      res.status(200).json({ users });
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  }
