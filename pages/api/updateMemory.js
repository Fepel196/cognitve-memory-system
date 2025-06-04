export default function handler(req, res) {
  if (!global.memory) global.memory = [];

  if (req.method === 'POST') {
    const { entry } = req.body;
    if (entry) {
      global.memory.push(entry);
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'No entry provided' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
