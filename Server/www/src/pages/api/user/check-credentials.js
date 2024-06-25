import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';
import { omit } from 'lodash';

export default async function handle(req, res) {
    if (req.method === "POST") {
      await handlePOST(res, req);
    } else {
      throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
    }
  }
  
  const hashPassword = (password) => {
    const sha256Hash = crypto.createHash('sha256');
    sha256Hash.update(password);
    return sha256Hash.digest('hex');
  };
  
  // POST /api/user
  async function handlePOST(res, req) {
    let prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { username: req.body.username },
      select: {
        username: true,
        password: true,
        role: true,
        permissions: true,
        tag: true,
      },
    });
    if (user && user.password === hashPassword(req.body.password)) {
      console.log("password correct");
      res.json(omit(user, "password"));
    } else {
      console.log("incorrect credentials");
      res.status(400).end("Invalid credentials");
    }
  }
  