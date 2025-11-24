import { useState } from "react"

export default function ChangePasswordModal({ user, open, onClose, onSave }) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-zinc-400 hover:text-red-400" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4 neon-text">Trocar Senha</h2>
        <div className="mb-4 text-zinc-300 text-sm">Usuário: <b>{user?.globalName || user?.username || user?.email}</b></div>
        <label className="block mb-2 text-sm">Nova Senha</label>
        <input className="input w-full mb-4" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-red-400 text-xs mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn-primary" disabled={loading || !password} onClick={async () => {
            setLoading(true)
            setError("")
            try {
              await onSave(password)
            } catch (e) {
              setError(e.message || "Erro ao trocar senha")
            }
            setLoading(false)
          }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}
