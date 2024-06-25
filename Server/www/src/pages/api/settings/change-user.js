import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    let prisma = new PrismaClient();

    if (req.method === 'POST') {
        const { username, perm, permissions, value } = req.body;
        try {
            
            const updatedUser = await prisma.user.update({
                where: {
                    username
                },
                data: {
                    permissions
                }
            })

            res.status(200).json({ message: 'ok' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error' });
          }
    }
  }
