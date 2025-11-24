

import { NextResponse } from 'next/server';
import { getUserFromCookie } from '@/lib/auth';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Criar nova notícia
export async function POST(request) {
  const user = await getUserFromCookie(cookies());
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
  const { titulo, conteudo, imagem, categoria, destaque } = await request.json();
  if (!titulo || !conteudo) {
    return NextResponse.json({ error: 'Título e conteúdo obrigatórios' }, { status: 400 });
  }
  // Se não vier imagem, força uma imagem padrão de teste
  const imagemFinal = imagem && imagem.trim() !== '' ? imagem : 'https://via.placeholder.com/400x250?text=Noticia';
  const noticia = await prisma.news.create({
    data: {
      title: titulo,
      content: conteudo,
      image: imagemFinal,
      category: categoria || 'Games',
      destaque: !!destaque,
      authorId: user.id,
      published: true
    }
  });
  return NextResponse.json({ success: true, noticia });
}

// Remover notícia
export async function DELETE(request) {
  const user = await getUserFromCookie(cookies());
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
  const { id } = await request.json();
  const noticia = await prisma.news.delete({ where: { id } });
  if (!noticia) {
    return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

// Editar notícia
export async function PUT(request) {
  const user = await getUserFromCookie(cookies());
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
  const { id, titulo, conteudo, imagem, categoria, destaque } = await request.json();
  // Se não vier imagem, força uma imagem padrão de teste
  const imagemFinal = imagem && imagem.trim() !== '' ? imagem : 'https://via.placeholder.com/400x250?text=Noticia';
  const noticia = await prisma.news.update({
    where: { id },
    data: {
      title: titulo,
      content: conteudo,
      image: imagemFinal,
      category: categoria,
      destaque: destaque !== undefined ? !!destaque : undefined,
    }
  });
  if (!noticia) {
    return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
  }
  return NextResponse.json({ success: true, noticia });
}
