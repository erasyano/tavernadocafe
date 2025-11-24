import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'

// Estrutura em memória: { userId, friendId, status: 'pending'|'accepted'|'rejected' }
const friendships = global._friendships || (global._friendships = [])

// GET: /api/friends?userId=xxx
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 })
  }
  // Lista de amizades do usuário
  const friends = friendships.filter(f => (f.userId === userId || f.friendId === userId) && f.status === 'accepted')
  const pending = friendships.filter(f => (f.friendId === userId && f.status === 'pending'))
  return NextResponse.json({ friends, pending })
}

// POST: /api/friends { userId, friendId }
export async function POST(request) {
  const { userId, friendId } = await request.json()
  if (!userId || !friendId || userId === friendId) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
  // Verifica se já existe amizade
  const exists = friendships.find(f => (
    (f.userId === userId && f.friendId === friendId) ||
    (f.userId === friendId && f.friendId === userId)
  ))
  if (exists) {
    return NextResponse.json({ error: 'Solicitação já existe' }, { status: 400 })
  }
  friendships.push({ userId, friendId, status: 'pending' })
  return NextResponse.json({ success: true })
}

// PUT: /api/friends { userId, friendId, action: 'accept'|'reject' }
export async function PUT(request) {
  const { userId, friendId, action } = await request.json()
  if (!userId || !friendId || !['accept','reject'].includes(action)) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
  const friendship = friendships.find(f => f.userId === friendId && f.friendId === userId && f.status === 'pending')
  if (!friendship) {
    return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
  }
  friendship.status = action === 'accept' ? 'accepted' : 'rejected'
  return NextResponse.json({ success: true })
}
