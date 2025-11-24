// DELETE: Exclui um sorteio
export async function DELETE(req) {
  try {
    const data = await req.json();
    await prisma.sorteio.delete({ where: { id: data.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao excluir sorteio" }, { status: 400 });
  }
}
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Lista todos os sorteios
export async function GET() {
  try {
    const sorteios = await prisma.sorteio.findMany({
      orderBy: { dataFim: "desc" }
    });
    return NextResponse.json({ sorteios });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao buscar sorteios" }, { status: 500 });
  }
}

// POST: Cria um novo sorteio
export async function POST(req) {
  try {
    const data = await req.json();
    const novo = await prisma.sorteio.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        premio: data.premio,
        dataFim: new Date(data.dataFim),
        imagemUrl: data.imagemUrl || null,
        ativo: true
      }
    });
    return NextResponse.json({ sorteio: novo });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao criar sorteio" }, { status: 400 });
  }
}
