const correctSecret = process.env.LOGIN_SECRET;

export default function handler(req, res) {
  const { query } = req;
  if (query.secret === correctSecret) {
    res.status(200).json({ message: 'Login page content goes here' });
  } else {
    res.status(403).json({ message: 'Access forbidden. Incorrect secret.' });
  }
}
