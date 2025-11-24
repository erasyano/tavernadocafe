import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  const { url } = req.body;
  if (!url || !url.startsWith('/uploads/')) {
    return res.status(400).json({ error: 'URL inválida' });
  }
  const filePath = path.join(process.cwd(), 'public', url);
  try {
    await fs.unlink(filePath);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
}
