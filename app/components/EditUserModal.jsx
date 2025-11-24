import { useState } from "react"

export default function EditUserModal({ user, open, onClose, onSave }) {
  const [form, setForm] = useState({
    globalName: user?.globalName || '',
    username: user?.username || ''
  })
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-zinc-400 hover:text-red-400" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4 neon-text">Editar Perfil</h2>
        <label className="block mb-2 text-sm">Nome</label>
        <input className="input w-full mb-4" value={form.globalName} onChange={e => setForm(f => ({ ...f, globalName: e.target.value }))} />
        <label className="block mb-2 text-sm">@</label>
        <input className="input w-full mb-4" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={() => onSave(form)}>Salvar</button>
        </div>
      </div>
    </div>
  )
}
