"use client"
import { useEffect, useState } from "react"
import { UserPlus, Users, UserCheck, UserX } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FriendsPage() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState('friends') // friends | requests | add
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
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.users)) {
          setUsers(data.users.filter(u => u.id !== user.id))
        }
      })
    fetch(`/api/friends?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setFriends(data.friends || [])
        setPending(data.pending || [])
      })
  }, [user])

  async function sendRequest(friendId) {
    await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, friendId })
    })
    fetch(`/api/friends?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setFriends(data.friends || [])
        setPending(data.pending || [])
      })
  }

  async function respondRequest(friendId, action) {
    await fetch("/api/friends", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, friendId, action })
    })
    fetch(`/api/friends?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setFriends(data.friends || [])
        setPending(data.pending || [])
      })
  }

  if (loading) return <div className="pt-24 text-center text-lg">Carregando amizades...</div>

  // IDs dos amigos aceitos
  const friendIds = friends.map(f => f.userId === user.id ? f.friendId : f.userId)
  // IDs de solicitações pendentes recebidas
  const pendingFrom = pending.map(f => f.userId)
  // IDs de solicitações pendentes enviadas
  const pendingTo = pending.map(f => f.friendId)

  return (
    <div className="pt-24 min-h-screen bg-discord-dark">
      <div className="w-full max-w-5xl mx-auto px-4 py-8 flex gap-8 z-10 relative bg-zinc-900/80 rounded-2xl shadow-2xl">
        {/* Menu lateral */}
        <aside className="w-56 min-w-[180px] pr-2 flex flex-col gap-2 mt-4">
          <h2 className="text-lg font-bold text-zinc-300 mb-2">Amizades</h2>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold text-base flex items-center gap-2 transition-all ${section === 'friends' ? 'bg-discord-neon/80 text-zinc-900 shadow' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
            onClick={() => setSection('friends')}
          >
            <UserCheck className="w-5 h-5" /> Meus Amigos
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold text-base flex items-center gap-2 transition-all ${section === 'requests' ? 'bg-discord-neon/40 text-zinc-200 shadow' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
            onClick={() => setSection('requests')}
          >
            <UserX className="w-5 h-5" /> Solicitações Recebidas
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold text-base flex items-center gap-2 transition-all ${section === 'add' ? 'bg-discord-purple/40 text-zinc-200 shadow' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
            onClick={() => setSection('add')}
          >
            <UserPlus className="w-5 h-5" /> Adicionar Amigos
          </button>
        </aside>
        {/* Conteúdo principal */}
        <main className="flex-1 flex flex-col items-center">
          <h1 className="text-2xl font-bold neon-text mb-6 flex items-center gap-2"><Users className="w-7 h-7" /> Amizades</h1>
          <div className="w-full max-w-2xl bg-discord-card rounded-xl p-6 border border-discord-purple/20 shadow flex flex-col gap-6 min-h-[400px]">
            {section === 'friends' && (
              <>
                <h2 className="text-lg font-semibold mb-2">Meus Amigos</h2>
                <ul className="flex flex-wrap gap-3 mb-2">
                  {friendIds.length === 0 && <li className="text-zinc-400">Nenhum amigo ainda.</li>}
                  {users.filter(u => friendIds.includes(u.id)).map(u => (
                    <li key={u.id} className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg">
                      <UserCheck className="w-5 h-5 text-discord-neon" />
                      <span>{u.name || u.email}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {section === 'requests' && (
              <>
                <h2 className="text-lg font-semibold mb-2">Solicitações Recebidas</h2>
                <ul className="flex flex-col gap-2 mb-2">
                  {pending.filter(f => f.friendId === user.id).length === 0 && <li className="text-zinc-400">Nenhuma solicitação recebida.</li>}
                  {pending.filter(f => f.friendId === user.id).map(f => {
                    const u = users.find(u => u.id === f.userId)
                    return u && (
                      <li key={f.userId} className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg">
                        <span>{u.name || u.email}</span>
                        <button className="btn-primary px-2 py-1 text-xs" onClick={() => respondRequest(u.id, 'accept')}>Aceitar</button>
                        <button className="btn-secondary px-2 py-1 text-xs" onClick={() => respondRequest(u.id, 'reject')}>Recusar</button>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
            {section === 'add' && (
              <>
                <h2 className="text-lg font-semibold mb-2">Adicionar Amigos</h2>
                <ul className="flex flex-wrap gap-3">
                  {users.filter(u => u.id !== user.id && !friendIds.includes(u.id) && !pendingFrom.includes(u.id) && !pendingTo.includes(u.id)).length === 0 && <li className="text-zinc-400">Nenhum usuário disponível.</li>}
                  {users.filter(u => u.id !== user.id && !friendIds.includes(u.id) && !pendingFrom.includes(u.id) && !pendingTo.includes(u.id)).map(u => (
                    <li key={u.id} className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg">
                      <UserPlus className="w-5 h-5 text-discord-neon" />
                      <span>{u.name || u.email}</span>
                      <button className="btn-primary px-2 py-1 text-xs" onClick={() => sendRequest(u.id)}>Adicionar</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
