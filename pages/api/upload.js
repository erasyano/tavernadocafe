import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  await fs.mkdir(path.join(process.cwd(), 'public', 'uploads'), { recursive: true });
  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), 'public', 'uploads'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer upload' });
    }
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    const fileName = path.basename(file.filepath);
    const fileUrl = `/uploads/${fileName}`;
    return res.status(200).json({ url: fileUrl });
  });
}
