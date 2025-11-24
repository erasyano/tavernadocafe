
import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'
import { cookies } from 'next/headers'

const users = global._users || (global._users = [])

export async function GET() {
  const user = await getUserFromCookie(cookies())
  if (!user) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  // Retorna todos os dados relevantes do usuário
  return NextResponse.json({
    users: users.map(u => ({
      id: u.id,
      name: u.globalName || u.name,
      email: u.email,
      isAdmin: !!u.isAdmin,
      avatar: u.avatar,
      bio: u.bio
    }))
  })
}
