"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Send, Inbox } from "lucide-react"


export default function MessagesPage() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState("")
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("inbox") // inbox | sent
  const [users, setUsers] = useState([])
  const [toUser, setToUser] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(data => {
      if (!data.authenticated) {
        router.replace("/login")
      } else {
        setUser(data.user)
        setLoading(false)
      }
    })
  }, [router])

  useEffect(() => {
    if (!user) return
    fetch(`/api/messages?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setMessages(data.messages || []))
    // Busca lista de usuários para dropdown
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.users)) {
          setUsers(data.users.filter(u => u.id !== user.id))
        }
      })
  }, [user])

  async function sendMessage(e) {
    e.preventDefault()
    if (!newMsg.trim() || !toUser) return
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: user.id, to: toUser, content: newMsg })
    })
    if (res.ok) {
      setNewMsg("")
      setToUser("")
      fetch(`/api/messages?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setMessages(data.messages || []))
    }
  }

  if (loading) return <div className="pt-24 text-center text-lg">Carregando mensagens...</div>

  // Separar recebidas e enviadas
  const inbox = messages.filter(m => m.to === user?.id)
  const sent = messages.filter(m => m.from === user?.id)

  return (
    <div className="pt-24 min-h-screen bg-discord-dark">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex gap-8 z-10 relative bg-zinc-900/80 rounded-2xl shadow-2xl">
        {/* Menu lateral */}
        <aside className="w-56 min-w-[180px] pr-2 flex flex-col gap-2 mt-4">
          <h2 className="text-lg font-bold text-zinc-300 mb-2">Mensagens</h2>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold text-base flex items-center gap-2 transition-all ${tab === "inbox" ? "bg-discord-neon/80 text-zinc-900 shadow" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"}`}
            onClick={() => setTab("inbox")}
          >
            <Inbox className="w-5 h-5" /> Recebidas
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold text-base flex items-center gap-2 transition-all ${tab === "sent" ? "bg-discord-neon/40 text-zinc-200 shadow" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"}`}
            onClick={() => setTab("sent")}
          >
            <Send className="w-5 h-5" /> Enviadas
          </button>
        </aside>
        {/* Conteúdo principal */}
        <main className="flex-1 flex flex-col items-center">
          <h1 className="text-2xl font-bold neon-text mb-6">Caixa de Mensagens</h1>
          <div className="w-full max-w-2xl bg-discord-card rounded-xl p-6 border border-discord-purple/20 shadow flex flex-col gap-4 min-h-[400px]">
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[350px] py-2">
              {(tab === "inbox" ? inbox : sent).length === 0 && (
                <div className="text-zinc-400 text-center mt-12">Nenhuma mensagem {tab === "inbox" ? "recebida" : "enviada"}.</div>
              )}
              {(tab === "inbox" ? inbox : sent).map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${tab === "inbox" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`relative max-w-[80%] px-4 py-3 rounded-2xl shadow-lg flex flex-col ${
                      tab === "inbox"
                        ? "bg-zinc-800 text-left text-zinc-100"
                        : "bg-discord-neon/10 text-right text-discord-neon border border-discord-neon/30"
                    }`}
                  >
                    {/* Destaque para mensagens do site/admin */}
                    {msg.from === "site" || msg.from === "admin" ? (
                      <span className="absolute -top-5 left-0 text-xs text-discord-neon font-bold flex items-center gap-1"><Mail className="w-4 h-4 inline" /> Mensagem do Site</span>
                    ) : null}
                    <span className="text-base break-words whitespace-pre-line">{msg.content}</span>
                    <span className="text-xs text-zinc-400 mt-2 self-end">{new Date(msg.date).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Formulário de envio com escolha de destinatário */}
            {tab === "sent" && (
              <form onSubmit={sendMessage} className="flex flex-col md:flex-row gap-2 mt-4 items-center">
                <select
                  className="input w-full md:w-auto"
                  value={toUser}
                  onChange={e => setToUser(e.target.value)}
                  required
                >
                  <option value="">Escolha o destinatário...</option>
                  {users.map(u => (
                    <option key={u.id || u.email} value={u.id || u.email}>
                      {u.name ? `${u.name} (${u.email})` : u.email}
                    </option>
                  ))}
                </select>
                <input
                  className="input flex-1"
                  placeholder="Digite sua mensagem..."
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  required
                />
                <button className="btn-primary px-4 flex items-center gap-2"><Send className="w-4 h-4" /> Enviar</button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
