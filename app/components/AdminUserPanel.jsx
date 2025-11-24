"use client"
import { useEffect, useState } from "react"
import EditUserModal from "./EditUserModal"
import ChangePasswordModal from "./ChangePasswordModal"
import SorteiosPanel from "./SorteiosPanel"

export default function AdminUserPanel({ currentUser }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [showOnlyDiscord, setShowOnlyDiscord] = useState(false)
  const [showOnlyRegistered, setShowOnlyRegistered] = useState(false)
  const [actionLoading, setActionLoading] = useState("")
  const [editUser, setEditUser] = useState(null)
  const [changePassUser, setChangePassUser] = useState(null)
  const adminEmail = "albertomartinscaju@gmail.com"

  useEffect(() => {
    fetch("/api/admin/list-users").then(res => res.json()).then(data => {
      setUsers(Array.isArray(data?.users) ? data.users : [])
      setLoading(false)
    })
  }, [])

  function getAt(user) {
    if (user.username && user.username.startsWith('discord:')) {
      return '@' + user.username.replace('discord:', '')
    }
    if (user.username && user.username.startsWith('@')) {
      return user.username
    }
    return ''
  }

  function filteredUsers() {
    let filtered = users
    if (filter) {
      const searchLower = filter.toLowerCase().replace(/^@/, "");
      filtered = filtered.filter(u => {
        const atUser = getAt(u).replace(/^@/, "").toLowerCase();
        return (
          (u.globalName || u.username || "").toLowerCase().includes(searchLower) ||
          (u.email || "").toLowerCase().includes(searchLower) ||
          atUser.includes(searchLower)
        );
      });
    }
    if (showOnlyDiscord) filtered = filtered.filter(u => getAt(u).includes('#'))
    if (showOnlyRegistered) filtered = filtered.filter(u => getAt(u).startsWith('@') && !getAt(u).includes('#'))
    return filtered
  }

  async function handleAdminChange(user, makeAdmin) {
    if (user.email === adminEmail && !makeAdmin) return alert("Você não pode remover admin deste usuário!")
    setActionLoading(user.id)
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, makeAdmin })
    })
    setActionLoading("")
    if (res.ok) {
      setUsers(users => users.map(u => u.id === user.id ? { ...u, isAdmin: makeAdmin } : u))
    } else {
      alert("Erro ao alterar admin")
    }
  }

  if (loading) return <div className="text-zinc-400">Carregando usuários...</div>
  return (
    <>
      <EditUserModal
        user={editUser}
        open={!!editUser}
        onClose={() => setEditUser(null)}
        onSave={async (form) => {
          if (!editUser) return
          await fetch('/api/admin/edit-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editUser.id, ...form })
          })
          setUsers(users => users.map(u => u.id === editUser.id ? { ...u, ...form } : u))
          setEditUser(null)
        }}
      />
      <ChangePasswordModal
        user={changePassUser}
        open={!!changePassUser}
        onClose={() => setChangePassUser(null)}
        onSave={async (newPassword) => {
          if (!changePassUser) return
          const res = await fetch('/api/admin/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: changePassUser.id, password: newPassword })
          })
          const data = await res.json()
          if (data.ok) {
            alert('Senha alterada com sucesso!')
            setChangePassUser(null)
          } else {
            throw new Error(data.error || 'Erro ao trocar senha')
          }
        }}
      />
      <div className="w-full max-w-7xl bg-zinc-900/90 rounded-2xl shadow-xl p-8 mt-6 z-20 relative border border-discord-neon/60">
        <h2 className="text-xl font-bold mb-4 neon-text">Usuários</h2>
        <div className="flex gap-2 mb-4">
          <input className="input w-96 max-w-xl" placeholder="Filtrar por nome/email/@usuario" value={filter} onChange={e => setFilter(e.target.value)} />
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={showOnlyDiscord} onChange={e => setShowOnlyDiscord(e.target.checked)} /> Discord
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={showOnlyRegistered} onChange={e => setShowOnlyRegistered(e.target.checked)} /> Registrado
          </label>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-discord-neon border-b border-discord-purple/30">
              <th className="py-2">Status</th>
              <th>Nome</th>
              <th>@</th>
              <th>Email</th>
              <th>Origem</th>
              <th>Admin</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers().map(u => (
            <tr key={u.id} className="border-b border-zinc-800 hover:bg-discord-purple/10 transition">
              <td className="py-2">
                <span style={{display:'inline-block',width:12,height:12,borderRadius:'50%',background:u.email==="albertomartinscaju@gmail.com"?"#22c55e":"#ef4444",boxShadow:'0 0 2px #000'}}></span>
              </td>
              <td className="py-2">{u.globalName || u.username}</td>
              <td>{getAt(u)}</td>
              <td>{u.email}</td>
              <td>{getAt(u).includes('#') ? "Discord" : "Site"}</td>
              <td>{u.isAdmin ? <span className="text-discord-neon font-bold">Sim</span> : "Não"}</td>
              <td>
                {currentUser?.email === adminEmail && u.email !== adminEmail && (
                  <>
                    {u.isAdmin ? (
                      <button className="btn-danger text-xs mr-1" disabled={actionLoading === u.id} onClick={() => handleAdminChange(u, false)}>Remover Mod</button>
                    ) : (
                      <button className="btn-secondary text-[10px] px-2 py-1 mr-1" disabled={actionLoading === u.id} onClick={() => handleAdminChange(u, true)}>Tornar Mod</button>
                    )}
                    {/* Só para contas cujo @ não tem # (não Discord) */}
                    {!getAt(u).includes('#') && (
                      <>
                        <button className="btn-secondary text-[10px] px-2 py-1 mr-1" onClick={() => setChangePassUser(u)}>Trocar Senha</button>
                        <button className="btn-secondary text-[10px] px-2 py-1 mr-1" onClick={() => setEditUser(u)}>Editar Perfil</button>
                      </>
                    )}
                    {u.isBanned ? (
                      <button className="btn-secondary text-[10px] px-2 py-1 bg-red-900/80 hover:bg-red-800 text-red-200" style={{float:'right'}} disabled={actionLoading === 'ban-' + u.id} onClick={async () => {
                        setActionLoading('ban-' + u.id)
                        try {
                          const res = await fetch('/api/admin/ban-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, ban: false }) })
                          let data = {}
                          try { if (res.headers.get("content-type")?.includes("application/json")) { data = await res.json() } } catch {}
                          if (!res.ok) {
                            alert('Erro ao desbanir: ' + (data.error || res.status))
                            console.error('Ban-user error:', data.error || data, { status: res.status, body: data })
                          } else {
                            setUsers(users => users.map(x => x.id === u.id ? { ...x, isBanned: false } : x))
                          }
                        } finally {
                          setActionLoading("")
                        }
                      }}>Desbanir</button>
                    ) : (
                      <button className="btn-secondary text-[10px] px-2 py-1 bg-red-900/80 hover:bg-red-800 text-red-200" style={{float:'right'}} disabled={actionLoading === 'ban-' + u.id} onClick={async () => {
                        setActionLoading('ban-' + u.id)
                        try {
                          const res = await fetch('/api/admin/ban-user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, ban: true }) })
                          let data = {}
                          try { if (res.headers.get("content-type")?.includes("application/json")) { data = await res.json() } } catch {}
                          if (!res.ok) {
                            alert('Erro ao banir: ' + (data.error || res.status))
                            console.error('Ban-user error:', data.error || data, { status: res.status, body: data })
                          } else {
                            setUsers(users => users.map(x => x.id === u.id ? { ...x, isBanned: true } : x))
                          }
                        } finally {
                          setActionLoading("")
                        }
                      }}>Banir</button>
                    )}
                  </>
                )}
                {u.email === adminEmail && <span className="text-zinc-400 text-xs ml-2">Protegido</span>}
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
