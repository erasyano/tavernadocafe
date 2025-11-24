import { NextResponse } from 'next/server'




import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const allNews = await prisma.news.findMany({
    orderBy: [
      { destaque: 'desc' },
      { createdAt: 'desc' }
    ],
    include: { author: { select: { id: true, globalName: true, email: true } } }
  });
  const total = allNews.length;
  const totalPages = Math.ceil(total / perPage);
  const pageNoticias = allNews.slice(start, end).map(noticia => ({
    id: noticia.id,
    titulo: noticia.title,
    texto: noticia.content,
    imagem: noticia.image,
    categoria: noticia.category,
    data: noticia.createdAt,
    fonte: noticia.author?.globalName || noticia.author?.email || 'Admin',
    url: '',
    // outros campos se necessário
  }));
  return NextResponse.json({ noticias: pageNoticias, total, totalPages, page });
}
