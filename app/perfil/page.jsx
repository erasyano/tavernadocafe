"use client"

import { useEffect, useState, useRef } from 'react'
import { avatarList } from './avatarList'
import Link from 'next/link'

export default function PerfilPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showAvatarGallery, setShowAvatarGallery] = useState(false)
  const fileInputRef = useRef()

  useEffect(() => {
    fetch('/api/perfil')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          // Restaurar enquadramento salvo
          setZoom(typeof data.user.avatarZoom === 'number' ? data.user.avatarZoom : 1);
          setOffset({
            x: typeof data.user.avatarOffsetX === 'number' ? data.user.avatarOffsetX : 0,
            y: typeof data.user.avatarOffsetY === 'number' ? data.user.avatarOffsetY : 0
          });
          setRotation(typeof data.user.avatarRotation === 'number' ? data.user.avatarRotation : 0);
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])


  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    const form = e.target;
    const displayName = form.displayName.value;
    const username = form.username.value;
    const email = form.email.value;
    const bio = form.bio.value;
    // O avatar será o preview selecionado ou o já salvo
    const avatarUrl = avatarPreview || user.avatar;
    await saveProfile(displayName, username, email, bio, avatarUrl);
    setSaving(false);
  }

  async function saveProfile(displayName, username, email, bio, avatar) {
    try {
      const res = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          username,
          email,
          bio,
          avatar
        })
      });
      const data = await res.json();
      if (data.ok) {
        setUser(data.user);
        setSuccess(true);
        setAvatarPreview(null);
      } else {
        setError(data.error || 'Erro ao salvar');
      }
    } catch (err) {
      setError('Erro de rede ou servidor: ' + err.message);
      console.error('Erro ao salvar perfil:', err);
    }
  }

  // Substitui upload: seleciona avatar da galeria
  function handleAvatarSelect(avatarUrl) {
    setAvatarPreview(avatarUrl);
    setShowAvatarGallery(false);
  }

  // Remove função de reajustar avatar (não é mais necessário)

  if (loading) return <div className="pt-24 text-center text-lg">Carregando perfil...</div>
  if (!user) return <div className="pt-24 text-center text-lg text-red-400">Faça login para acessar seu perfil.</div>

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-[#181a2a] via-[#23244d] to-[#1a1a2e] flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto px-2 py-10 z-10 relative bg-zinc-900/80 rounded-2xl shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center tracking-widest bg-gradient-to-r from-discord-neon via-discord-purple to-discord-blue bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(106,13,173,0.7)]">Meu Perfil</h1>
        <div className="flex flex-col md:flex-row items-start gap-10 w-full justify-center">
          {/* Bloco do Avatar flutuante */}
          <div className="flex flex-col items-center gap-5 w-full md:w-80 md:shrink-0 bg-gradient-to-br from-[#23244d]/80 to-[#181a2a]/90 rounded-3xl p-8 border-2 border-discord-neon/40 shadow-2xl backdrop-blur-md mb-8 md:mb-0 md:mr-4">
            <div className="relative group">
              <div className="w-36 h-36 rounded-full ring-4 ring-discord-neon shadow-[0_0_32px_8px_rgba(106,13,173,0.25)] bg-zinc-900 overflow-hidden flex items-center justify-center transition-all duration-300 hover:ring-8 hover:shadow-[0_0_48px_16px_rgba(106,13,173,0.35)]">
                {avatarPreview || user.avatar ? (
                  <img
                    src={avatarPreview || user.avatar}
                    alt={user.globalName}
                    className="object-cover w-full h-full drop-shadow-[0_0_16px_rgba(106,13,173,0.5)]"
                    style={{ transform: `scale(1) translate(0px, 0px)` }}
                  />
                ) : null}
              </div>
              <button
                type="button"
                className={`absolute bottom-2 right-2 bg-discord-neon text-white rounded-full p-2 ${user.username && user.username.startsWith('discord:') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group-hover:scale-110'} transition shadow-lg border-2 border-white/10`}
                title={user.username && user.username.startsWith('discord:') ? 'Avatar sincronizado com o Discord' : 'Alterar avatar'}
                onClick={() => {
                  if (!(user.username && user.username.startsWith('discord:'))) setShowAvatarGallery(true);
                }}
                disabled={user.username && user.username.startsWith('discord:')}
              >
                <span className="text-base font-bold">✎</span>
              </button>
            </div>
            {avatarPreview && (
              <div className="flex flex-col gap-3 bg-zinc-900/95 p-4 rounded-xl shadow-2xl z-10 w-52 mt-2 border border-discord-neon/30">
                {/* Nenhum ajuste de dimensão, pois avatares são fixos */}
              </div>
            )}
          </div>
          {/* Bloco de informações e formulário flutuante */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-3 w-full max-w-xl bg-gradient-to-br from-[#23244d]/80 to-[#181a2a]/90 rounded-3xl p-8 border-2 border-discord-purple/30 shadow-2xl backdrop-blur-md">
            {/* Formulário de edição */}
            <form
              onSubmit={handleSubmit}
              className="relative bg-gradient-to-br from-[#181a2a] via-[#23244d] to-[#1a1a2e] rounded-2xl p-8 shadow-2xl border-2 border-discord-neon/40 w-full max-w-2xl mt-8 transition-none"
            >
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-discord-neon tracking-wide">Nome de Exibição</span>
                <input type="text" name="displayName" defaultValue={user.globalName} className="bg-zinc-900/80 border-2 border-discord-neon/30 rounded-lg px-4 py-2 text-lg text-white focus:outline-none focus:border-discord-neon transition-all shadow-inner" maxLength={32} required />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-discord-purple tracking-wide">@username</span>
                <input
                  type="text"
                  name="username"
                  defaultValue={user.username}
                  className="bg-zinc-900/80 border-2 border-discord-purple/30 rounded-lg px-4 py-2 text-lg text-white focus:outline-none focus:border-discord-purple transition-all shadow-inner"
                  maxLength={24}
                  pattern="^@?[a-zA-Z0-9_]+$"
                  title="Pode começar com @, seguido de letras, números e _"
                  required
                  disabled={user.username && user.username.startsWith('discord:')}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-discord-blue tracking-wide">Email</span>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  className="bg-zinc-900/80 border-2 border-discord-blue/30 rounded-lg px-4 py-2 text-lg text-white focus:outline-none focus:border-discord-blue transition-all shadow-inner"
                  required
                  disabled={user.username && user.username.startsWith('discord:')}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-discord-neon tracking-wide">Bio</span>
                <textarea name="bio" defaultValue={user.bio || ''} className="bg-zinc-900/80 border-2 border-discord-neon/20 rounded-lg px-4 py-2 text-base text-white focus:outline-none focus:border-discord-neon transition-all shadow-inner resize-none" rows={3} maxLength={256} placeholder="Fale um pouco sobre você..." />
              </label>
              <button
                type="submit"
                className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-discord-neon via-discord-purple to-discord-blue text-white font-extrabold shadow-lg hover:scale-105 hover:shadow-[0_0_24px_8px_rgba(0,255,231,0.25)] transition-all text-lg mx-auto block"
              >
                Salvar alterações
              </button>

              {/* Bloco de troca de senha */}
              <div className="w-full flex flex-col items-center mt-8">
                <details className="w-full max-w-md">
                  <summary className="cursor-pointer text-discord-neon font-bold text-lg mb-2">Trocar senha</summary>
                  <form
                    className="flex flex-col gap-3 bg-zinc-900/80 border border-discord-neon/20 rounded-xl p-4 mt-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target;
                      const senhaAtual = form.senhaAtual.value;
                      const novaSenha = form.novaSenha.value;
                      const confirmaSenha = form.confirmaSenha.value;
                      if (novaSenha !== confirmaSenha) {
                        alert('A nova senha e a confirmação não coincidem.');
                        return;
                      }
                      const res = await fetch('/api/perfil/change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ senhaAtual, novaSenha })
                      });
                      const data = await res.json();
                      if (data.ok) {
                        alert('Senha alterada com sucesso!');
                        form.reset();
                      } else {
                        alert(data.error || 'Erro ao trocar senha.');
                      }
                    }}
                  >
                    <input type="password" name="senhaAtual" className="bg-zinc-900/80 border-2 border-discord-neon/30 rounded-lg px-4 py-2 text-lg text-white focus:outline-none focus:border-discord-neon transition-all shadow-inner" placeholder="Senha atual" required />
                    <input type="password" name="novaSenha" className="bg-zinc-900/80 border-2 border-discord-neon/30 rounded-lg px-4 py-2 text-lg text-white focus:outline-none focus:border-discord-neon transition-all shadow-inner" placeholder="Nova senha" minLength={6} required />
                    <input type="password" name="confirmaSenha" className="bg-zinc-900/80 border-2 border-discord-neon/30 rounded-lg px-4 py-2 text-lg text-white focus:outline-none focus:border-discord-neon transition-all shadow-inner" placeholder="Confirmar nova senha" minLength={6} required />
                    <button type="submit" className="mt-2 px-6 py-2 rounded-xl bg-gradient-to-r from-discord-neon via-discord-purple to-discord-blue text-white font-bold shadow-lg hover:scale-105 transition-all">Trocar senha</button>
                  </form>
                </details>
              </div>

              {success && (
                <div className="w-full flex justify-center mt-4">
                  <span className="text-green-400 font-bold text-lg bg-zinc-900/80 px-6 py-2 rounded-xl shadow-md animate-fade-in">
                    Alterações salvas com sucesso!
                  </span>
                </div>
              )}
              {error && <span className="text-red-400 font-semibold text-center">{error}</span>}
            </form>
          </div>
        </div>

        {/* Renderize a galeria de avatar por último para garantir que fique acima de tudo */}
        {showAvatarGallery && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-gradient-to-br from-[#181a2a] via-[#23244d] to-[#1a1a2e] rounded-3xl p-10 shadow-[0_0_64px_16px_rgba(0,255,231,0.25)] border-4 border-discord-neon/70 flex flex-col items-center w-[1100px] max-w-[99vw] mx-1 mt-20">
              <h3 className="text-2xl font-extrabold text-discord-neon mb-6 tracking-wide drop-shadow animate-pulse-slow">Escolha seu Avatar</h3>
              <div className="grid grid-rows-4 grid-flow-col gap-3 py-2 px-2 w-full justify-center items-center">
                {avatarList.map((avatar, idx) => {
                  const isSelected = (avatarPreview || user.avatar) === avatar;
                  return (
                    <button
                      key={avatar}
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`group relative transition-transform focus:outline-none ${isSelected ? 'ring-4 ring-discord-neon scale-110 z-10' : ''}`}
                      style={{ minWidth: 52, margin: '2px' }}
                    >
                      <span className="absolute -top-2 -right-2 animate-pulse pointer-events-none">
                        {isSelected && (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ffe7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-glow">
                            <circle cx="12" cy="12" r="10" stroke="#00ffe7" strokeWidth="2.5" fill="#181a2a" />
                            <polyline points="8 12.5 11 15.5 16 10" stroke="#00ffe7" strokeWidth="2.5" fill="none" />
                          </svg>
                        )}
                      </span>
                      <img
                        src={avatar}
                        alt={`Avatar ${idx+1}`}
                        className={`w-12 h-12 rounded-full border-4 ${isSelected ? 'border-discord-neon' : 'border-zinc-700'} shadow-xl bg-zinc-800 object-cover transition-all duration-200 group-hover:scale-[2] group-hover:z-30`}
                        style={{ filter: isSelected ? 'brightness(1.15) drop-shadow(0 0 12px #00ffe7)' : 'none' }}
                      />
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setShowAvatarGallery(false)} className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-discord-neon via-discord-purple to-discord-blue text-white font-extrabold shadow-lg hover:scale-105 transition-all text-lg">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
