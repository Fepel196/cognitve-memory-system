import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'memory.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const newEntry = req.body.entry;
    data.entries.push(newEntry);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Memory updated successfully.' });
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
