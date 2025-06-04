export default function handler(req, res) {
  const memory = global.memory || [];
  res.status(200).json({ memory });
}
