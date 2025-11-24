
import { NextResponse } from 'next/server';

export async function GET() {
	// Remove o cookie de autenticação
	const response = NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL || '/');
	response.cookies.set('auth_token', '', {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		expires: new Date(0)
	});
	return response;
}

