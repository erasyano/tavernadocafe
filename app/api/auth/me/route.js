
import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  const user = await getUserFromCookie(cookies());
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  // Retorna todos os dados relevantes do usuário para manter sessão e perfil sincronizados
  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      isAdmin: !!user.isAdmin,
      avatar: user.avatar,
      globalName: user.globalName,
      bio: user.bio,
      username: user.username
    }
  });
}
