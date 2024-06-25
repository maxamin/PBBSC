import { PrismaClient } from "@prisma/client";
const crypto = require('crypto');

const prisma = new PrismaClient();

function sha256(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

export default async function handle(req, res) {

  if (req.method === 'POST') {
    const { username, password, role, tag } = req.body;
    try {
        const createdUser = await prisma.user.create({
        data: {
            username,
            password: sha256(password),
            tag,
            role
        },
        });

        res.json(createdUser);
    } catch (error) {
        res.status(400).json({ error: 'An error occured while trying to create the user' });
    }
}
}
