import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { cookies } from 'next/headers'

const ADMIN_EMAIL = 'albertomartinscaju@gmail.com'

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const admin = getUserFromCookie(cookieStore);
    if (!admin || admin.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Apenas o admin master pode banir.' }, { status: 403 })
    }
    const { id, ban } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Informe o id do usuário.' }, { status: 400 })
    }
    // Não permite banir o admin master
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
    if (user.email === ADMIN_EMAIL) return NextResponse.json({ error: 'Não é possível banir o admin master.' }, { status: 403 })
    await prisma.user.update({ where: { id }, data: { isBanned: !!ban } })
    return NextResponse.json({ ok: true, banned: !!ban })
  } catch (err) {
    console.error('[BAN-USER ERROR]', err && err.message ? err.message : err)
    if (err && err.stack) console.error(err.stack)
    return NextResponse.json({ error: 'Erro ao banir: ' + (err && err.message ? err.message : String(err)) }, { status: 500 })
  }
}