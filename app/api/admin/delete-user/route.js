import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Endpoint temporário para remover usuário por id ou username
export async function POST(request) {
  const { id, username } = await request.json()
  if (!id && !username) {
    return NextResponse.json({ error: 'Informe id ou username.' }, { status: 400 })
  }
  const where = id ? { id } : { username }
  const deleted = await prisma.user.deleteMany({ where })
  return NextResponse.json({ ok: true, deleted: deleted.count })
}
