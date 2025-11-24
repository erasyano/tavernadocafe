import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const data = await request.json();
    const email = (data.email || '').toLowerCase().trim();
    const password = data.password;
    if (!email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.provider !== 'local') {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }
    if (user.isBanned) {
      return NextResponse.json({ error: 'Usuário banido.' }, { status: 403 });
    }
    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
    }
    // Gera JWT e seta cookie httpOnly
    const token = createToken({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      globalName: user.globalName,
      username: user.username,
      avatar: user.avatar
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });
    return response;
  } catch (err) {
    console.error('[LOGINLOCAL ERROR]', err && err.message ? err.message : err);
    if (err && err.stack) console.error(err.stack);
    return NextResponse.json({ error: 'Erro ao autenticar: ' + (err && err.message ? err.message : String(err)) }, { status: 500 });
  }
}
