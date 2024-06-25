import { PrismaClient } from "@prisma/client";
const crypto = require('crypto');

export default async function handle(req, res) {
    let prisma = new PrismaClient();

    function sha256(data) {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('hex');
    }

    if (req.method === 'POST') {
        const { username, old_pass, password } = req.body;
            
            const user = await prisma.user.findUnique({
                where: {
                  username
                },
            })

            if (user.password === sha256(old_pass)) {
                const changeuser = await prisma.user.update({
                    where: {
                        username
                    },
                    data: {
                        password: sha256(password)
                    }
                })

                res.status(200).json({ message: 'ok' });
            } else {
                res.status(200).json({ error: 'Wrong password' });
            }
    }
  }
