

import { NextResponse } from 'next/server';

export async function GET() {
	// Redireciona para o Discord OAuth
	const params = new URLSearchParams({
		client_id: process.env.DISCORD_CLIENT_ID,
		redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
		response_type: 'code',
		scope: 'identify email',
		prompt: 'consent'
	});
	const discordAuthUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
	return NextResponse.redirect(discordAuthUrl);
}

