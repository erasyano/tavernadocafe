import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Detalhe de uma notícia
export async function GET(request, { params }) {
  const { id } = params;
  const news = await prisma.news.findUnique({
    where: { id },
    include: { author: { select: { id: true, globalName: true, email: true } } }
  });
  if (!news) return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
  return NextResponse.json({ news });
}

// PUT: Edita uma notícia
export async function PUT(request, { params }) {
  const { id } = params;
  const cookieStore = cookies();
  const user = await getUserFromCookie(cookieStore);
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
  const data = await request.json();
  const news = await prisma.news.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      image: data.image || null,
      published: !!data.published
    }
  });
  return NextResponse.json({ news });
}

// DELETE: Remove uma notícia
export async function DELETE(request, { params }) {
  const { id } = params;
  const cookieStore = cookies();
  const user = await getUserFromCookie(cookieStore);
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
  await prisma.news.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

