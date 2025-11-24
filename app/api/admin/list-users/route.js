import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Endpoint temporário para listar todos os usuários cadastrados
export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, username: true, globalName: true, isAdmin: true, provider: true, isBanned: true }
  })
  return NextResponse.json({ users })
}
