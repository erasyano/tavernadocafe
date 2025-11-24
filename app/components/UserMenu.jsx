'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'


export default function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState(user)
  const menuRef = useRef(null)
  const router = useRouter();
  const closeTimeout = useRef(null);

  // Função de logout
  const handleLogout = async () => {
    try {
      window.location.href = '/api/auth/logout';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 glass-effect px-4 py-2 rounded-lg hover:border-discord-purple transition-all duration-300"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Image
          src={user.avatar || '/default-avatar.png'}
          alt={user.globalName}
          width={32}
          height={32}
          className="rounded-full ring-2 ring-discord-purple/50 object-cover"
        />
        <span className="font-semibold text-white text-base">{profile?.globalName || user.globalName}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-discord-card/95 backdrop-blur-md border border-discord-purple/30 rounded-xl shadow-lg z-50"
            style={{ background: 'rgba(43,45,49,0.97)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
            onMouseLeave={() => {
              closeTimeout.current = setTimeout(() => setIsOpen(false), 500);
            }}
            onMouseEnter={() => {
              if (closeTimeout.current) clearTimeout(closeTimeout.current);
            }}
          >
            <div className="p-4 flex flex-col items-center gap-2">
              <Image
                src={user.avatar || '/default-avatar.png'}
                alt={user.globalName}
                width={64}
                height={64}
                className="rounded-full ring-4 ring-discord-purple/60 object-cover"
              />
              <span className="font-bold text-lg text-white">{profile?.globalName || user.globalName}</span>
              <span className="text-xs text-gray-400">{profile?.username || user.username}</span>
            </div>
            <div className="border-t border-white/10" />
            <div className="flex flex-col p-2">
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-lg mb-1 hover:bg-discord-purple/10 transition-all text-[#b18fff] text-sm font-bold"
                onClick={() => router.push('/perfil')}
              >
                <User className="w-5 h-5" /> Perfil
              </button>
              {user?.isAdmin && (
                <button
                  className="flex items-center gap-3 px-4 py-2 mb-1 rounded-lg hover:bg-discord-neon/10 transition-all text-discord-neon text-sm font-bold"
                  onClick={() => router.push('/admin')}
                >
                  <Sparkles className="w-5 h-5" /> Painel Admin
                </button>
              )}
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-discord-neon/10 transition-all text-discord-neon text-sm font-bold"
                onClick={() => router.push('/perfil/tavernaclass')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ffe7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg> Taverna Class
              </button>
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-discord-purple/10 transition-all text-white text-sm"
                onClick={() => router.push('/configuracoes')}
              >
                <Settings className="w-5 h-5" /> Configurações
              </button>
              <button
                className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-red-400 hover:text-red-300 hover:bg-red-900/10 text-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" /> Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
