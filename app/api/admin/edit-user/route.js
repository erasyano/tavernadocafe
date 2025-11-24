import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

const ADMIN_EMAIL = 'albertomartinscaju@gmail.com'

export async function POST(request) {
  const admin = await getUserFromCookie(request)
  if (!admin || admin.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Apenas o admin master pode editar.' }, { status: 403 })
  }
  const { id, globalName, username } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
  if (user.provider === 'discord') return NextResponse.json({ error: 'Não é possível editar perfil de conta Discord.' }, { status: 403 })
  await prisma.user.update({ where: { id }, data: { globalName, username } })
  return NextResponse.json({ ok: true })
}
