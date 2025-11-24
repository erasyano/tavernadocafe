import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || '.jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);
  await writeFile(uploadPath, buffer);
  return NextResponse.json({ url: `/uploads/${fileName}` });
}
