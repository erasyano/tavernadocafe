"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ConfiguracoesPage() {

  const [user, setUser] = useState(null)
  const [prefs, setPrefs] = useState({ notificacoes: true, privacidade: false })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/perfil').then(res => res.json()),
      fetch('/api/configuracoes').then(res => res.json())
    ]).then(([userData, prefsData]) => {
      if (userData.user) setUser(userData.user)
      if (prefsData.prefs) setPrefs(prefsData.prefs)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    setSaving(true)
    const form = e.target
    const notificacoes = form.notificacoes.checked
    const privacidade = form.privacidade.checked
    const res = await fetch('/api/configuracoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificacoes, privacidade })
    })
    const data = await res.json()
    if (data.ok) {
      setPrefs(data.prefs)
      setSuccess(true)
    } else {
      setError(data.error || 'Erro ao salvar')
    }
    setSaving(false)
  }

  if (loading) return <div className="pt-24 text-center text-lg">Carregando configurações...</div>
  if (!user) return <div className="pt-24 text-center text-lg text-red-400">Faça login para acessar as configurações.</div>

  return (
    <div className="pt-24 min-h-screen bg-discord-dark">
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 neon-text flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-discord-neon"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>
          Configurações da Conta
        </h1>
        <p className="text-gray-400 mb-6">Gerencie suas preferências, privacidade e notificações da sua conta Taverna do Café.</p>
        <div className="flex flex-col gap-6">
          <div className="bg-discord-card rounded-xl p-6 border border-discord-purple/30 shadow-lg flex flex-col gap-4">
            <h2 className="text-xl font-bold text-discord-neon mb-2">Preferências Gerais</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="notificacoes" className="accent-discord-neon w-5 h-5" defaultChecked={prefs.notificacoes} />
                <span className="font-semibold text-white">Receber notificações por e-mail</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="privacidade" className="accent-discord-neon w-5 h-5" defaultChecked={prefs.privacidade} />
                <span className="font-semibold text-white">Perfil privado <span className="text-xs text-gray-400">(oculta suas informações para outros usuários)</span></span>
              </label>
              <button type="submit" className="btn-primary w-fit mt-2" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Preferências'}</button>
              {success && <span className="text-green-400 font-semibold">Preferências salvas com sucesso!</span>}
              {error && <span className="text-red-400 font-semibold">{error}</span>}
            </form>
          </div>
          <div className="bg-discord-card rounded-xl p-6 border border-discord-blue/30 shadow flex flex-col gap-2">
            <h2 className="text-lg font-bold text-discord-blue mb-1">Dicas de Segurança</h2>
            <ul className="list-disc pl-6 text-gray-300 text-sm space-y-1">
              <li>Nunca compartilhe sua senha com ninguém.</li>
              <li>Ative a autenticação em duas etapas no Discord para mais segurança.</li>
              <li>Revise suas permissões de aplicativos conectados regularmente.</li>
            </ul>
          </div>
          <div className="text-right mt-2">
            <Link href="/perfil" className="text-discord-neon underline">Voltar ao Perfil</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
