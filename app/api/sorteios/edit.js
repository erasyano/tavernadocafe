import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH: Edita um sorteio
export async function PATCH(req) {
  try {
    const data = await req.json();
    const editado = await prisma.sorteio.update({
      where: { id: data.id },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        premio: data.premio,
        dataFim: new Date(data.dataFim),
        imagemUrl: data.imagemUrl || null,
        ativo: data.ativo
      }
    });
    return NextResponse.json({ sorteio: editado });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao editar sorteio" }, { status: 400 });
  }
}

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
