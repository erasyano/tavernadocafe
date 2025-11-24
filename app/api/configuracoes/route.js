import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'

// Simulação de um banco de dados em memória (substitua por DB real depois)
const fakeUserPrefsDB = new Map()

export async function POST(request) {
  const user = await getUserFromCookie(request)
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  const data = await request.json()
  // Preferências simples
  const notificacoes = !!data.notificacoes
  const privacidade = !!data.privacidade
  fakeUserPrefsDB.set(user.id, { notificacoes, privacidade })
  return NextResponse.json({ ok: true, prefs: { notificacoes, privacidade } })
}

export async function GET(request) {
  const user = await getUserFromCookie(request)
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  const prefs = fakeUserPrefsDB.get(user.id) || { notificacoes: true, privacidade: false }
  return NextResponse.json({ prefs })
}
