import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request) {
	try {
		const data = await request.json();
		const name = (data.name || '').trim().slice(0, 32);
		const email = (data.email || '').toLowerCase().trim();
		const password = data.password;
		if (!name || !email || !password) {
			return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 });
		}
		// Verifica se já existe
		const exists = await prisma.user.findUnique({ where: { email } });
		if (exists) {
			return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 409 });
		}
		// Gera username único
		let baseUsername = `@${name.replace(/\s+/g, '').toLowerCase()}`;
		let username = baseUsername;
		let count = 1;
		while (await prisma.user.findUnique({ where: { username } })) {
			username = `${baseUsername}${count}`;
			count++;
		}
		// Cria usuário local, admin apenas para o email específico
		const hashed = await hash(password, 10);
		const isAdmin = email === "albertomartinscaju@gmail.com";
		const user = await prisma.user.create({
			data: {
				globalName: name,
				email,
				password: hashed,
				username,
				provider: 'local',
				isAdmin
			}
		});
		return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, username: user.username, globalName: user.globalName, isAdmin: user.isAdmin } });
	} catch (err) {
		console.error('[REGISTER ERROR]', err && err.message ? err.message : err);
		if (err && err.stack) console.error(err.stack);
		return NextResponse.json({ error: 'Erro ao registrar: ' + (err && err.message ? err.message : String(err)) }, { status: 500 });
	}
}



