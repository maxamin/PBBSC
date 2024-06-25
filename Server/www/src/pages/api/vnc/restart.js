import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Method Not Allowed' });
    return;
  }

  const command = "killall vnc &"
  const startvnc = "/root/vnc &"

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }

  });

  exec(startvnc, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }

  });

  return res.status(200).json( "ok" );
}
