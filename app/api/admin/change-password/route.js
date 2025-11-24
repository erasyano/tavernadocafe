import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { hash } from 'bcryptjs'

const ADMIN_EMAIL = 'albertomartinscaju@gmail.com'

export async function POST(request) {
  const admin = await getUserFromCookie(request)
  if (!admin || admin.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Apenas o admin master pode trocar senha.' }, { status: 403 })
  }
  const { id, password } = await request.json()
  if (!id || !password) return NextResponse.json({ error: 'ID e senha obrigatórios.' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
  if (user.provider === 'discord') return NextResponse.json({ error: 'Não é possível trocar senha de conta Discord.' }, { status: 403 })
  const senhaHash = await hash(password, 10)
  await prisma.user.update({ where: { id }, data: { password: senhaHash } })
  return NextResponse.json({ ok: true })
}
