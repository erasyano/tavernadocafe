import { NextResponse } from 'next/server'

export function middleware(request) {
  // Páginas protegidas que requerem autenticação
  const protectedPaths = ['/dashboard', '/perfil', '/configuracoes']
  const { pathname } = request.nextUrl
  
  // Verifica se a rota atual é protegida
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath) {
    const token = request.cookies.get('auth_token')?.value
    
    // Se não tem token, redireciona para home
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('error', 'authentication_required')
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/perfil/:path*', '/configuracoes/:path*'],
}
