const DISCORD_API_BASE = 'https://discord.com/api/v10'
const DISCORD_CDN_BASE = 'https://cdn.discordapp.com'

const safe = v => (v || '').replace(/\0/g, '');
export const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${safe(process.env.DISCORD_CLIENT_ID)}&redirect_uri=${encodeURIComponent(safe(process.env.DISCORD_REDIRECT_URI))}&response_type=code&scope=identify%20email`

export async function exchangeCodeForToken(code) {
  const response = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: safe(process.env.DISCORD_CLIENT_ID),
      client_secret: safe(process.env.DISCORD_CLIENT_SECRET),
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: safe(process.env.DISCORD_REDIRECT_URI),
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  return await response.json()
}

export async function getDiscordUser(accessToken) {
  const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get Discord user')
  }

  return await response.json()
}

export function getAvatarUrl(user) {
  if (!user.avatar) {
    const defaultAvatarNumber = parseInt(user.discriminator) % 5
    return `${DISCORD_CDN_BASE}/embed/avatars/${defaultAvatarNumber}.png`
  }
  
  const format = user.avatar.startsWith('a_') ? 'gif' : 'png'
  return `${DISCORD_CDN_BASE}/avatars/${user.id}/${user.avatar}.${format}?size=128`
}

export function formatDiscordUser(user) {
  return {
    id: user.id,
    username: user.username,
    discriminator: user.discriminator,
    globalName: user.global_name || user.username,
    avatar: getAvatarUrl(user),
    email: user.email,
  }
}
