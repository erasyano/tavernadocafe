import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email obrigatório.' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
  if (user.isBanned) return NextResponse.json({ error: 'Usuário banido.' }, { status: 403 })
  return NextResponse.json({ ok: true })
}
