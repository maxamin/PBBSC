import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
    let prisma = new PrismaClient();
    if (req.method === 'POST') {
        const { usernames } = req.body;

        try {
            usernames.forEach(async (username) => {
            await prisma.user.delete({
              where: {
                username,
              },
            });
            })
            res.status(200).json({ message: 'Users deleted successfully' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while deleting the user' });
          }
    }
  }
