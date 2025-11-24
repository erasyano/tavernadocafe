import { NextResponse } from 'next/server'
import { exchangeCodeForToken, getDiscordUser, formatDiscordUser } from '@/lib/discord'
import { createToken } from '@/lib/auth'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Se o usuário negou acesso
  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=access_denied`)
  }

  // Se não tem código de autorização
  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=no_code`)
  }

  try {
    // Trocar code por access token
    const tokenData = await exchangeCodeForToken(code)
    // Buscar dados do usuário
    const discordUser = await getDiscordUser(tokenData.access_token)
    // Formatar dados do usuário e prefixar username
    const user = formatDiscordUser(discordUser)
    const discordUsername = `discord:${user.username}${user.discriminator ? '#' + user.discriminator : ''}`
    // Cria ou atualiza usuário no banco
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        username: discordUsername,
        globalName: user.globalName,
        email: user.email,
        avatar: user.avatar,
        bio: '',
        provider: 'discord'
        // NÃO sobrescreve isAdmin ao atualizar!
      },
      create: {
        id: user.id,
        username: discordUsername,
        globalName: user.globalName,
        email: user.email,
        avatar: user.avatar,
        bio: '',
        password: '-',
        isAdmin: false,
        provider: 'discord'
      }
    })
    if (dbUser.isBanned) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=banido`)
    }
    // Criar JWT com dados do banco
    const token = await createToken({
      id: dbUser.id,
      email: dbUser.email,
      isAdmin: dbUser.isAdmin,
      globalName: dbUser.globalName,
      username: dbUser.username,
      avatar: dbUser.avatar
    })
    // Redirecionamento dinâmico
    let redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?refresh=1`
    const state = searchParams.get('state')
    if (state) {
      // Mantém outros parâmetros e adiciona refresh=1
      const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}${decodeURIComponent(state)}`, process.env.NEXT_PUBLIC_BASE_URL)
      url.searchParams.set('refresh', '1')
      redirectTo = url.toString()
    }
    // Criar resposta com redirect
    const response = NextResponse.redirect(redirectTo)
    // Setar cookie com expiração de 30 dias
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 dias
    })
    return response
  } catch (error) {
    console.error('Error in Discord callback:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?error=auth_failed`)
  }
}
