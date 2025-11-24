import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  let { id } = params;
  if (typeof id !== 'string') id = String(id);
  const noticia = await prisma.news.findUnique({
    where: { id },
    include: { author: { select: { id: true, globalName: true, email: true } } }
  });
  if (!noticia) return NextResponse.json({ noticia: null });
  // Adapta campos para compatibilidade com frontend
  return NextResponse.json({ noticia: {
    ...noticia,
    texto: noticia.content,
    titulo: noticia.title,
    imagem: noticia.image || '/default-news.png',
    categoria: noticia.category,
    data: noticia.createdAt,
    fonte: noticia.author?.globalName || noticia.author?.email || 'Admin',
    url: ''
  }});
}
