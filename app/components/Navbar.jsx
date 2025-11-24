"use client"

import Link from 'next/link'
import { Coffee, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import UserMenu from './UserMenu'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'


function NavbarContent() {
  const [user, setUser] = useState(null)
  const [showAuthMenu, setShowAuthMenu] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams && searchParams.get('refresh') === '1') {
      const url = new URL(window.location.href)
      url.searchParams.delete('refresh')
      window.location.replace(url.toString())
      return
    }
    async function fetchUser() {
      try {
        const res = await fetch('/api/perfil', { cache: 'no-store', credentials: 'include' })
        const data = await res.json();
        if (res.ok && data.user) setUser(data.user)
        else setUser(null)
      } catch (err) {
        setUser(null)
      }
    }
    fetchUser()
    window.addEventListener('focus', fetchUser)
    window.addEventListener('storage', fetchUser)
    return () => {
      window.removeEventListener('focus', fetchUser)
      window.removeEventListener('storage', fetchUser)
    }
  }, [pathname, searchParams])
  return (
    <>
      {/* <style jsx global>{`
      `}</style> */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-discord-purple to-discord-blue rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <Coffee className="w-8 h-8 text-discord-purple relative z-10" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold neon-text">Taverna do Café</span>
                <span className="text-xs text-gray-400">Taverna Club</span>
              </div>
            </Link>
            {/* Links de navegação */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className={`navbar-link${pathname === '/' ? ' active' : ''}`}>
                <span className={pathname === '/' ? 'neon-gradient' : ''}>Início</span>
                <span className="neon-underline"></span>
              </Link>
              <Link href="/dashboard" className={`navbar-link${pathname === '/dashboard' ? ' active' : ''}`}>
                <span className={pathname === '/dashboard' ? 'neon-gradient' : ''}>Dashboard</span>
                <span className="neon-underline"></span>
              </Link>
              <Link href="/jogos" className={`navbar-link${pathname === '/jogos' ? ' active' : ''}`}>
                <span className={pathname === '/jogos' ? 'neon-gradient' : ''}>Jogos em Oferta</span>
                <span className="neon-underline"></span>
              </Link>
              <Link href="/youtube" className={`navbar-link${pathname === '/youtube' ? ' active' : ''}`}>
                <span className={pathname === '/youtube' ? 'neon-gradient' : ''}>YouTube</span>
                <span className="neon-underline"></span>
              </Link>
              <motion.a 
                href="/sorteio"
                className={`navbar-link flex items-center gap-2${pathname === '/sorteio' ? ' active' : ''}`}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className={pathname === '/sorteio' ? 'neon-gradient' : ''}>Sorteios</span>
                <span className="neon-underline"></span>
              </motion.a>
            </div>
            {/* User Menu ou Login Button */}
            {user ? (
                <div className="flex flex-row gap-3 items-center">
                <Link href="/friends" className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-discord-card border border-discord-purple/30 hover:bg-discord-purple/10 transition-all shadow"
                    title="Amizades"
                  >
                    <span className="text-2xl" role="img" aria-label="amizades">🤝</span>
                  </motion.button>
                </Link>
                <Link href="/messages" className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-discord-card border border-discord-purple/30 hover:bg-discord-purple/10 transition-all shadow"
                    title="Mensagens"
                  >
                    <span className="text-2xl" role="img" aria-label="mensagens">📬</span>
                  </motion.button>
                  {/* Badge de novas mensagens futuramente */}
                </Link>
                <UserMenu user={user} />
              </div>
            ) : (
              <div className="flex flex-row gap-1 items-center relative">
                <Link href="/api/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Entrar com Discord
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
                  onClick={() => setShowAuthMenu(v => !v)}
                >
                  Entrar / Registrar
                </motion.button>
                {showAuthMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed top-20 right-6 w-72 max-w-xs bg-discord-card/95 backdrop-blur-md border border-discord-purple/30 rounded-xl shadow-lg z-50 p-4 flex flex-col gap-2"
                    style={{ right: '1.5rem' }}
                  >
                    <button className="btn-secondary w-full" onClick={() => window.location.href = '/login'}>
                      Login com Email
                    </button>
                    <button className="btn-secondary w-full" onClick={() => window.location.href = '/register'}>
                      Registrar-se
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.nav>
    </>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
