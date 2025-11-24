
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Lista todas as notícias
export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, globalName: true, email: true } } }
  });
  return NextResponse.json({ news });
}

// POST: Cria uma nova notícia
export async function POST(request) {
  try {
    const cookieStore = cookies();
    const user = await getUserFromCookie(cookieStore);
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }
    const data = await request.json();
    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Título e conteúdo são obrigatórios.' }, { status: 400 });
    }
    const news = await prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        image: data.image || null,
        category: data.category || null,
        destaque: !!data.destaque,
        published: !!data.published,
        authorId: user.id
      }
    });
    return NextResponse.json({ news });
  } catch (err) {
    console.error('ERRO AO CRIAR NOTÍCIA:', err);
    return NextResponse.json({ error: 'Erro interno ao criar notícia', details: String(err) }, { status: 500 });
  }
}
