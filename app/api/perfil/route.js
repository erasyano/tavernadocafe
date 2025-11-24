
import { NextResponse } from 'next/server'
import { getUserFromCookie } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const user = await getUserFromCookie(cookieStore);
    if (!user) {
      console.log('Não autenticado')
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    const data = await request.json()
    // Loga apenas os tamanhos dos campos de imagem para evitar logs gigantes
    const logData = { ...data };
    if (logData.avatar && typeof logData.avatar === 'string') logData.avatar = `[base64] (${logData.avatar.length} chars)`;
    if (logData.avatarOriginal && typeof logData.avatarOriginal === 'string') logData.avatarOriginal = `[base64] (${logData.avatarOriginal.length} chars)`;
    console.log('==== [API /api/perfil] Dados recebidos no backend ====', logData)
    const displayName = (data.displayName || '').trim().slice(0, 32)
    const bio = (data.bio || '').trim().slice(0, 256)
    let avatar = data.avatar || user.avatar
    let avatarOriginal = user.avatarOriginal
    // Se avatar for base64 (novo upload), substitui avatarOriginal pelo novo
    if (avatar && avatar.startsWith('data:image/')) {
      avatarOriginal = data.avatarOriginal || avatar;
    }
    // Loga apenas os tamanhos dos campos de imagem para evitar logs gigantes
    const logSave = {
      globalName: displayName,
      bio,
      avatar: avatar && typeof avatar === 'string' ? `[base64] (${avatar.length} chars)` : avatar,
      avatarOriginal: avatarOriginal && typeof avatarOriginal === 'string' ? `[base64] (${avatarOriginal.length} chars)` : avatarOriginal,
      avatarZoom: data.avatarZoom,
      avatarOffsetX: data.avatarOffsetX,
      avatarOffsetY: data.avatarOffsetY,
      avatarRotation: data.avatarRotation
    };
    console.log('==== [API /api/perfil] Antes de salvar no banco ====', logSave);
    // Atualiza nome, bio, avatar e transformações do avatar
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        globalName: displayName,
        bio,
        avatar,
        avatarOriginal,
        avatarZoom: typeof data.avatarZoom === 'number' ? data.avatarZoom : null,
        avatarOffsetX: typeof data.avatarOffsetX === 'number' ? data.avatarOffsetX : null,
        avatarOffsetY: typeof data.avatarOffsetY === 'number' ? data.avatarOffsetY : null,
        avatarRotation: typeof data.avatarRotation === 'number' ? data.avatarRotation : null
      }
    })
    // Loga apenas o id e nome do usuário atualizado para evitar logs grandes
    console.log('==== [API /api/perfil] Usuário atualizado ====', {
      id: updatedUser.id,
      globalName: updatedUser.globalName,
      avatar: updatedUser.avatar ? `[base64] (${updatedUser.avatar.length} chars)` : null
    })
    return NextResponse.json({ ok: true, user: updatedUser })
  } catch (err) {
    let errorMsg = err && err.message ? err.message : String(err);
    if (err && err.stack) {
      errorMsg += '\n' + err.stack;
    }
    console.error('Erro no endpoint /api/perfil:', errorMsg);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET() {
  const cookieStore = cookies();
  const user = await getUserFromCookie(cookieStore);
  console.log('[API /api/perfil] getUserFromCookie:', user);
  if (!user) {
    console.log('[API /api/perfil] Não autenticado');
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  // Busca o usuário atualizado no banco
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  console.log('[API /api/perfil] dbUser:', dbUser);
  if (!dbUser) {
    console.log('[API /api/perfil] Usuário não encontrado');
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }
  return NextResponse.json({ user: dbUser });
}
