"use client"
import { useState, useEffect } from "react"
export default function SorteiosPanel({ modoPublico = false }) {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    premio: "",
    dataFim: "",
    imagemUrl: ""
  })
  const [loading, setLoading] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState("")
  // ...existing code...
  // Lista de sorteios
  const [sorteios, setSorteios] = useState([])
  const [carregandoSorteios, setCarregandoSorteios] = useState(true)
  // Paginação ativos/finalizados
  const [paginaAtivos, setPaginaAtivos] = useState(1)
  const [paginaFinalizados, setPaginaFinalizados] = useState(1)
  const ATIVOS_POR_PAGINA = 3
  const FINALIZADOS_POR_PAGINA = 5

  // Buscar sorteios ao carregar
  useEffect(() => {
    async function fetchSorteios() {
      setCarregandoSorteios(true)
      try {
        const res = await fetch("/api/sorteios")
        const data = await res.json()
        setSorteios(data.sorteios || [])
      } catch (e) {
        setSorteios([])
      }
      setCarregandoSorteios(false)
    }
    fetchSorteios()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      let res, data
      if (editandoId) {
        res = await fetch("/api/sorteios/edit", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: editandoId })
        })
        data = await res.json()
        if (!res.ok) throw new Error(data.error || "Erro ao editar sorteio")
        setSorteios(s => s.map(x => x.id === editandoId ? data.sorteio : x))
        setEditandoId(null)
      } else {
        res = await fetch("/api/sorteios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        })
        data = await res.json()
        if (!res.ok) throw new Error(data.error || "Erro ao criar sorteio")
        setSorteios(s => [data.sorteio, ...s])
      }
      setForm({ titulo: "", descricao: "", premio: "", dataFim: "", imagemUrl: "" })
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  function handleEditar(sorteio) {
    setForm({
      titulo: sorteio.titulo,
      descricao: sorteio.descricao,
      premio: sorteio.premio,
      dataFim: sorteio.dataFim ? sorteio.dataFim.slice(0, 10) : "",
      imagemUrl: sorteio.imagemUrl || ""
    })
    setEditandoId(sorteio.id)
  }

  async function handleExcluir(id) {
    if (!window.confirm("Tem certeza que deseja excluir este sorteio?")) return
    setLoading(true)
    setError("")
    try {
      // Busca o sorteio para pegar a imagem
      const sorteio = sorteios.find(x => x.id === id)
      // Se a imagem for de /uploads, tenta deletar
      if (sorteio?.imagemUrl && sorteio.imagemUrl.startsWith("/uploads/")) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: sorteio.imagemUrl })
        })
      }
      const res = await fetch("/api/sorteios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao excluir sorteio")
      setSorteios(s => s.filter(x => x.id !== id))
      if (editandoId === id) {
        setEditandoId(null)
        setForm({ titulo: "", descricao: "", premio: "", dataFim: "", imagemUrl: "" })
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  // ...existing code...

  // Paginação ativos
  const ativos = sorteios.filter(s => s.ativo)
  const ativosPaginados = ativos.slice((paginaAtivos-1)*ATIVOS_POR_PAGINA, paginaAtivos*ATIVOS_POR_PAGINA)
  const totalPaginasAtivos = Math.ceil(ativos.length / ATIVOS_POR_PAGINA)
  // Paginação finalizados
  const finalizados = sorteios.filter(s => !s.ativo)
  const finalizadosPaginados = finalizados.slice((paginaFinalizados-1)*FINALIZADOS_POR_PAGINA, paginaFinalizados*FINALIZADOS_POR_PAGINA)
  const totalPaginasFinalizados = Math.ceil(finalizados.length / FINALIZADOS_POR_PAGINA)

  if (modoPublico) {
    // Exibe o sorteio mais recente/ativo em destaque, estilo premium com moedas e símbolos de sorte
    const destaque = sorteios.find(s => s.ativo) || sorteios[0]
    if (!destaque) return (
      <div className="w-full flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold neon-text mb-4">Nenhum sorteio ativo no momento</h2>
        <p className="text-zinc-400">Fique ligado para os próximos sorteios!</p>
      </div>
    )
    // Calcular tempo restante
    const calcTempoRestante = (dataFim) => {
      const diff = new Date(dataFim) - new Date()
      if (diff <= 0) return 'Encerrado'
      const dias = Math.floor(diff / (1000*60*60*24))
      const horas = Math.floor((diff / (1000*60*60)) % 24)
      const mins = Math.floor((diff / (1000*60)) % 60)
      const segs = Math.floor((diff / 1000) % 60)
      return `${dias}d ${horas}h ${mins}m ${segs}s restantes`
    }
    return (
      <div className="w-full max-w-2xl mx-auto mt-10 bg-zinc-800/90 rounded-3xl shadow-2xl border-2 border-zinc-700 p-0 flex flex-col gap-0 animate-in relative overflow-hidden">
        {/* Prêmio em destaque */}
        <div className="flex flex-col items-center justify-center pt-10 pb-4 px-6 relative z-20">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold neon-text drop-shadow-lg">SORTEIO DE {destaque.premio?.toUpperCase() || 'PRÊMIO'}</h1>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-discord-neon font-bold text-base uppercase tracking-wider">LAR</span>
            <span className="text-discord-neon">●</span>
            <span className="text-white font-bold text-base uppercase tracking-wider">SORTEIOS</span>
          </div>
          <p className="text-lg text-zinc-200 mb-1 font-semibold text-center">{destaque.titulo}</p>
          <p className="text-zinc-400 mb-2 text-center">{destaque.descricao}</p>
          <div className="text-2xl font-bold text-discord-neon mb-4 drop-shadow animate-pulse">{calcTempoRestante(destaque.dataFim)}</div>
        </div>
        <style>{`
          .animate-glow-text {
            animation: glowText 2s ease-in-out infinite alternate;
          }
          @keyframes glowText {
            0% { text-shadow: 0 2px 24px #FFD700cc, 0 0 32px #2CFF7A; }
            100% { text-shadow: 0 2px 32px #FFD700, 0 0 48px #2CFF7A; }
          }
        `}</style>
        {/* Card embed premium */}
        <div className="bg-gradient-to-br from-zinc-900/90 via-discord-card/90 to-discord-blue/20 rounded-2xl p-6 border-2 border-discord-purple/40 flex flex-col gap-4 mx-4 mb-6 shadow-xl relative z-20">
          <div className="flex items-center gap-6">
            {destaque.imagemUrl ? (
              <img src={destaque.imagemUrl} alt="prêmio" className="w-24 h-24 rounded-xl object-cover border-2 border-discord-neon shadow-lg bg-zinc-800" />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-zinc-700 flex items-center justify-center text-zinc-400 text-2xl font-bold shadow-lg">IMG</div>
            )}
            <div className="flex-1 flex flex-col gap-2">
              <div className="font-bold text-lg text-white mb-1">REQUISITOS</div>
              <ul className="text-zinc-300 text-base list-none flex flex-col gap-1">
                <li>• Faça login com sua conta</li>
                <li>• Conecte sua conta do Discord</li>
                <li>• Entre no servidor da Taverna</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
            <div className="bg-zinc-900/80 px-4 py-2 rounded-lg text-zinc-200 font-semibold text-base border border-discord-purple/40 shadow">191 entradas</div>
            <button className="btn-primary text-base px-6 py-2 rounded-lg shadow-neon-blue flex items-center gap-2">Participar do Sorteio <span className="ml-1">→</span></button>
          </div>
        </div>
      </div>
    )
  }
  // ...modo admin normal...
  return (
    <div className="flex flex-row gap-10 justify-center items-start w-full max-w-[1600px] mx-auto px-2 animate-in">
      {/* Coluna lateral com sorteios ativos e finalizados */}
      <div className="w-[320px] min-w-[220px] flex flex-col gap-8">
        {/* Ativos */}
        <div>
          <h3 className="font-bold text-lg mb-3 neon-text">Sorteios Ativos</h3>
          <div className="glass-effect rounded-2xl p-5 shadow-xl min-h-[120px] border-2 border-discord-purple/60">
            {carregandoSorteios ? (
              <div className="text-zinc-400 text-sm">Carregando...</div>
            ) : ativos.length === 0 ? (
              <div className="text-zinc-400 text-sm">Nenhum sorteio ativo.</div>
            ) : (
              <>
                <ul className="space-y-4">
                  {ativosPaginados.map(s => (
                    <li key={s.id} className="flex items-center gap-3 bg-zinc-800/80 rounded-xl p-3 border border-green-700 shadow hover:scale-[1.03] transition-all">
                      {s.imagemUrl ? (
                        <img src={s.imagemUrl} alt="img" className="w-12 h-12 rounded-lg object-cover shadow bg-zinc-700" onError={e => { e.target.onerror=null; e.target.src='/assets/placeholder.png'; }} />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-700 flex items-center justify-center text-zinc-400 text-xs font-bold shadow">IMG</div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-zinc-100 text-base flex items-center gap-2">{s.titulo}
                          <span className="ml-1 px-2 py-0.5 rounded bg-green-700 text-xs text-white">Ativo</span>
                        </div>
                        <div className="text-xs text-zinc-400">até {new Date(s.dataFim).toLocaleDateString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                {totalPaginasAtivos > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    <button className="btn-secondary px-2 py-1 text-xs !rounded-full" disabled={paginaAtivos===1} onClick={()=>setPaginaAtivos(p=>p-1)}>&lt;</button>
                    <span className="text-xs text-zinc-400">{paginaAtivos}/{totalPaginasAtivos}</span>
                    <button className="btn-secondary px-2 py-1 text-xs !rounded-full" disabled={paginaAtivos===totalPaginasAtivos} onClick={()=>setPaginaAtivos(p=>p+1)}>&gt;</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* Finalizados */}
        <div>
          <h3 className="font-bold text-lg mb-3 neon-text">Sorteios Finalizados</h3>
          <div className="glass-effect rounded-2xl p-5 shadow-xl min-h-[120px] border-2 border-zinc-purple/40">
            {carregandoSorteios ? (
              <div className="text-zinc-400 text-sm">Carregando...</div>
            ) : finalizados.length === 0 ? (
              <div className="text-zinc-400 text-sm">Nenhum sorteio finalizado.</div>
            ) : (
              <>
                <ul className="space-y-4">
                  {finalizadosPaginados.map(s => (
                    <li key={s.id} className="flex items-center gap-3 bg-zinc-800/60 rounded-xl p-3 border border-zinc-700 shadow opacity-70 hover:scale-[1.02] transition-all">
                      {s.imagemUrl ? (
                        <img src={s.imagemUrl} alt="img" className="w-12 h-12 rounded-lg object-cover shadow bg-zinc-700" onError={e => { e.target.onerror=null; e.target.src='/assets/placeholder.png'; }} />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-700 flex items-center justify-center text-zinc-400 text-xs font-bold shadow">IMG</div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-zinc-100 text-base line-through flex items-center gap-2">{s.titulo}
                          <span className="ml-1 px-2 py-0.5 rounded bg-zinc-700 text-xs text-zinc-300">Finalizado</span>
                        </div>
                        <div className="text-xs text-zinc-400">encerrado {new Date(s.dataFim).toLocaleDateString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                {totalPaginasFinalizados > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    <button className="btn-secondary px-2 py-1 text-xs !rounded-full" disabled={paginaFinalizados===1} onClick={()=>setPaginaFinalizados(p=>p-1)}>&lt;</button>
                    <span className="text-xs text-zinc-400">{paginaFinalizados}/{totalPaginasFinalizados}</span>
                    <button className="btn-secondary px-2 py-1 text-xs !rounded-full" disabled={paginaFinalizados===totalPaginasFinalizados} onClick={()=>setPaginaFinalizados(p=>p+1)}>&gt;</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* Formulário e bloco principal */}
      <div className="flex-1 flex gap-8">
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 neon-text">Gerenciar Sorteios</h2>
          <div className="glass-effect p-12 rounded-3xl mb-8 shadow-2xl w-full max-w-none border-2 border-discord-purple/60 flex flex-col" style={{minWidth:'520px', width:'100%', maxWidth:'900px', alignSelf:'center'}}>
            <h3 className="font-bold mb-4 text-lg neon-text">Novo Sorteio</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Título do sorteio *</label>
            <input
              className="input w-full"
              name="titulo"
              placeholder="Ex: Super Sorteio de Jogos"
              value={form.titulo}
              onChange={handleChange}
              required
            />
            <span className="text-xs text-zinc-400">Nome que será exibido para o sorteio.</span>
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Descrição *</label>
            <textarea
              className="input w-full min-h-[60px]"
              name="descricao"
              placeholder="Explique as regras, como participar, etc."
              value={form.descricao}
              onChange={handleChange}
              required
            />
            <span className="text-xs text-zinc-400">Detalhes, regras ou informações extras do sorteio.</span>
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Prêmio *</label>
            <input
              className="input w-full"
              name="premio"
              placeholder="Ex: Gift Card, Jogo, etc."
              value={form.premio}
              onChange={handleChange}
              required
            />
            <span className="text-xs text-zinc-400">O que o vencedor irá ganhar.</span>
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Data de término *</label>
            <input
              className="input w-full"
              name="dataFim"
              type="date"
              value={form.dataFim}
              onChange={handleChange}
              required
            />
            <span className="text-xs text-zinc-400">Quando o sorteio será encerrado.</span>
          </div>
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Imagem do sorteio (URL)</label>
            <input
              className="input w-full"
              name="imagemUrl"
              placeholder="Cole o link da imagem (ex: /assets/avatars/1.png ou https://...)"
              value={form.imagemUrl}
              onChange={handleChange}
            />
            {form.imagemUrl && (
              <div className="mt-2">
                <img src={form.imagemUrl} alt="Preview" className="max-h-32 rounded shadow" />
              </div>
            )}
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex gap-2 mt-2">
            <button className="btn-primary !rounded-lg" type="submit" disabled={loading}>
              {loading ? (editandoId ? "Salvando..." : "Salvando...") : (editandoId ? "Salvar Alterações" : "Salvar Sorteio")}
            </button>
            {editandoId && (
              <button type="button" className="btn-secondary !rounded-lg" onClick={() => { setEditandoId(null); setForm({ titulo: "", descricao: "", premio: "", dataFim: "", imagemUrl: "" }) }}>Cancelar</button>
            )}
          </div>
        </form>
      </div>
        </div>
        {/* Todos os sorteios - lado direito */}
        <div className="w-[420px] min-w-[260px] flex flex-col items-center">
          <h3 className="font-bold mb-2 neon-text">Todos os Sorteios</h3>
          {carregandoSorteios ? (
            <div className="text-zinc-400 text-sm">Carregando...</div>
          ) : sorteios.length === 0 ? (
            <div className="text-zinc-400 text-sm">Nenhum sorteio cadastrado.</div>
          ) : (
            <ul className="space-y-7 w-full">
              {sorteios.map(s => (
                <li key={s.id} className={`glass-effect rounded-2xl p-6 flex flex-row gap-6 border-2 transition-all duration-200 shadow-2xl w-full hover:scale-[1.02] ${s.ativo ? 'border-green-600' : 'border-zinc-700 opacity-70'}`}>
                  {s.imagemUrl ? (
                    <img src={s.imagemUrl} alt="img" className="w-24 h-24 rounded-2xl object-cover shadow-lg bg-zinc-700" onError={e => { e.target.onerror=null; e.target.src='/assets/placeholder.png'; }} />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-zinc-700 flex items-center justify-center text-zinc-400 text-lg font-bold shadow-lg">IMG</div>
                  )}
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <div className="font-bold text-zinc-100 text-xl mb-1 flex items-center gap-2">
                        {s.titulo}
                        {s.ativo && <span className="ml-2 px-2 py-1 rounded bg-green-700 text-xs text-white">Ativo</span>}
                        {!s.ativo && <span className="ml-2 px-2 py-1 rounded bg-zinc-700 text-xs text-zinc-300">Finalizado</span>}
                      </div>
                      <div className="text-zinc-400 text-xs mb-1">Encerra em: {new Date(s.dataFim).toLocaleDateString()}</div>
                      <div className="text-zinc-300 text-base mb-1 line-clamp-2">{s.descricao}</div>
                      <div className="text-zinc-400 text-sm">Prêmio: <span className="font-semibold text-green-300">{s.premio}</span></div>
                    </div>
                    <div className="flex flex-row gap-2 mt-4 items-center">
                      <button
                        className="btn-secondary px-2 py-1 text-[11px] !rounded-lg !bg-zinc-700 !border-zinc-500 hover:!bg-zinc-600 shadow-sm"
                        style={{ minWidth: 48 }}
                        onClick={() => handleEditar(s)}
                      >Editar</button>
                      <span
                        className="text-red-600 hover:underline hover:text-red-700 cursor-pointer font-bold text-[12px] ml-2"
                        style={{ minWidth: 48, textAlign: 'center' }}
                        onClick={() => handleExcluir(s.id)}
                      >Excluir</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}