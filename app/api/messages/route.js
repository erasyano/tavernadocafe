import { NextResponse } from 'next/server'

// Mensagens em memória (substitua por banco de dados em produção)
const messages = global._messages || (global._messages = [])

// GET: /api/messages?userId=xxx
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 })
  }
  const userMessages = messages.filter(m => m.to === userId || m.from === userId)
  return NextResponse.json({ messages: userMessages })
}

// POST: /api/messages { from, to, content }
export async function POST(request) {
  const { from, to, content } = await request.json()
  if (!from || !to || !content) {
    return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 })
  }
  const msg = {
    id: Date.now().toString(),
    from,
    to,
    content,
    date: new Date().toISOString(),
    read: false
  }
  messages.push(msg)
  return NextResponse.json({ success: true, message: msg })
}
