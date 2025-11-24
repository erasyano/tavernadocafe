import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'
import prisma from '@/lib/prisma'

const ADMIN_EMAIL = 'albertomartinscaju@gmail.com'

export async function POST(request) {
  const admin = await getUserFromCookie(request)
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const { email, makeAdmin } = await request.json()
  if (email === ADMIN_EMAIL && (!makeAdmin)) {
    return NextResponse.json({ error: 'Você não pode remover admin deste usuário.' }, { status: 403 })
  }
  if (email !== ADMIN_EMAIL && admin.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Apenas o admin principal pode alterar cargos.' }, { status: 403 })
  }
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }
  await prisma.user.update({ where: { email }, data: { isAdmin: !!makeAdmin } })
  return NextResponse.json({ success: true })
}
