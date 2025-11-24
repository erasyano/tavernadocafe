'use client'

import { useState, useEffect, useRef } from 'react'
import GameOffersPanel from './GameOffersPanel'
import YoutubePage from '../youtube/page'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Users, Hash, Smile, Image as ImageIcon, Paperclip } from 'lucide-react'
import Image from 'next/image'


// Canais disponíveis (apenas Bate Papo e Jogos)
const CHANNELS = [
  { key: 'batepapo', label: 'Bate Papo', icon: Hash },
  { key: 'jogos', label: 'Jogos', icon: Hash },
  { key: 'youtube', label: 'YouTube', icon: Hash },
]

export default function CommunityChat({ user }) {
  const chatContainerRef = useRef(null)
  const [chatHeight, setChatHeight] = useState('calc(100vh - 96px)')
  useEffect(() => {
    function handleResize() {
      setChatHeight(`calc(100vh - 96px)`)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Estado do canal selecionado
  const [currentChannel, setCurrentChannel] = useState('batepapo')

  // Mensagens por canal (apenas Bate Papo e Jogos)
  const [messages, setMessages] = useState({
    batepapo: [
      {
        id: 1,
        user: { name: 'Sistema', avatar: '/logo.svg' },
        content: '🎉 Bem-vindo ao Bate Papo da Taverna do Café!',
        timestamp: new Date(Date.now() - 3600000),
        type: 'system'
      },
      {
        id: 2,
        user: { name: 'CaféLover', avatar: 'https://cdn.discordapp.com/embed/avatars/0.png' },
        content: 'Olá pessoal! Alguém aí?',
        timestamp: new Date(Date.now() - 1800000),
        type: 'message'
      },
      {
        id: 3,
        user: { name: 'TavernaAdmin', avatar: 'https://cdn.discordapp.com/embed/avatars/1.png' },
        content: 'Opa! Seja bem-vindo! 😊',
        timestamp: new Date(Date.now() - 900000),
        type: 'message'
      },
    ],
    jogos: [],
  })
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState(42)
  const messagesEndRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)

  // Scroll para o final do canal atual
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentChannel])

  // Simular usuários online variando
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Envio de mensagem só no canal Bate Papo
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    const message = {
      id: Date.now(),
      user: {
        name: user.globalName,
        avatar: user.avatar || '/default-avatar.png'
      },
      content: newMessage,
      timestamp: new Date(),
      type: 'message'
    }
    setMessages(prev => ({
      ...prev,
      [currentChannel]: [...(prev[currentChannel] || []), message]
    }))
    setNewMessage('')
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    if (diff < 60000) return 'agora'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m atrás`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div className="pt-24 px-0 pb-0 flex flex-col min-h-0" style={{height: '100vh'}}>
      <div
        className="container mx-auto max-w-7xl flex-1 flex flex-col lg:flex-row gap-6"
        ref={chatContainerRef}
        style={{height: chatHeight, minHeight: 0}}
      >
        
        {/* Sidebar - Canais e Usuários Online */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="card h-full flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-discord-purple" />
                Canais
              </h2>
              <div className="space-y-2">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.key}
                    className={`w-full text-left px-3 py-2 rounded-lg border border-white/10 font-semibold flex items-center gap-2 transition-all ${currentChannel === ch.key ? 'bg-gradient-to-r from-discord-purple/20 to-discord-blue/20 text-white' : 'hover:bg-discord-hover/30 text-gray-400'}`}
                    onClick={() => setCurrentChannel(ch.key)}
                  >
                    <ch.icon className="w-5 h-5" />
                    #{ch.label.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                Online — {onlineUsers}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {['Admin', 'Moderador', 'VIP', 'Membro'].map((role, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-discord-hover/20 transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-discord-purple to-discord-blue"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-discord-card"></div>
                    </div>
                    <span className="text-sm">{role}</span>
                              {/* Removido: Lista de pessoas online */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 card flex flex-col min-h-0"
          style={{minHeight: 0, height: '100%'}}
        >
          {/* Header do Canal */}
          <div className="border-b border-white/10 pb-4 mb-4">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Hash className="w-8 h-8 text-discord-purple" />
              <span className="neon-text">{CHANNELS.find(c => c.key === currentChannel)?.label || ''}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {currentChannel === 'batepapo' && 'Bate papo livre entre os membros da Taverna.'}
              {currentChannel === 'jogos' && 'Ofertas e promoções de jogos em tempo real.'}
                          {currentChannel === 'youtube' && 'Canal oficial da Taverna do Café no YouTube.'}
            </p>
          </div>

          {/* Área de Mensagens ou Painel de Ofertas */}
          {currentChannel === 'jogos' ? (
            <GameOffersPanel user={user} />
          ) : currentChannel === 'youtube' ? (
            <div className="flex-1 overflow-y-auto">
              <YoutubePage noOuter />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar min-h-0" style={{minHeight: 0}}>
                <AnimatePresence>
                  {(messages[currentChannel] || []).map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-3 ${message.type === 'system' ? 'justify-center' : ''}`}
                    >
                      {message.type === 'system' ? (
                        <div className="text-center py-2 px-4 bg-discord-purple/20 rounded-lg border border-discord-purple/30 text-sm">
                          {message.content}
                        </div>
                      ) : (
                        <div className="flex gap-3 p-4 rounded-xl hover:bg-discord-hover/20 transition-all duration-200 w-full group">
                          <div className="relative flex-shrink-0">
                            <Image
                              src={message.user.avatar || '/default-avatar.png'}
                              alt={message.user.name}
                              width={48}
                              height={48}
                              className="rounded-full ring-2 ring-discord-purple/50 group-hover:ring-discord-purple transition-all"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-discord-dark"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-white group-hover:text-discord-neon transition-colors">
                                {message.user.name}
                              </span>
                              <span className="text-xs text-gray-500 bg-discord-card px-2 py-0.5 rounded">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.type === 'bot' && (
                                <span className="text-xs bg-gradient-to-r from-discord-purple to-discord-blue text-white px-2 py-0.5 rounded font-semibold">
                                  BOT
                                </span>
                              )}
                            </div>
                            <p className="text-gray-200 break-words leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
              {/* Input de Mensagem */}
              <form onSubmit={handleSendMessage} className="flex gap-2 mt-0 sticky bottom-0 bg-discord-dark/80 z-10 p-2 rounded-b-xl backdrop-blur-xl">
                <div className="flex-1 flex items-center gap-2 glass-effect rounded-lg px-4 py-3 border border-white/10 focus-within:border-discord-purple transition-colors">
                  <button type="button" className="text-gray-400 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Envie uma mensagem para #${CHANNELS.find(c => c.key === currentChannel)?.label.toLowerCase()}`}
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                    disabled={currentChannel !== 'batepapo'}
                  />
                  <button type="button" className="text-gray-400 hover:text-white transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary px-6 flex items-center gap-2"
                  disabled={!newMessage.trim() || currentChannel !== 'batepapo'}
                >
                  <Send className="w-5 h-5" />
                  Enviar
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
