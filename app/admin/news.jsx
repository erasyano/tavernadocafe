"use client"
import { useEffect, useState } from "react"


export default function AdminNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    blocks: [
      { type: "image", value: "" },
      { type: "title", value: "" },
      { type: "paragraph", value: "" }
    ],
    published: false,
    category: ""
  })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => { fetchNews() }, [])

  async function fetchNews() {
    setLoading(true)
    const res = await fetch("/api/admin/news")
    const data = await res.json()
    setNews(data.news || [])
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    const method = editing ? "PUT" : "POST"
    const url = editing ? `/api/admin/news/${editing.id}` : "/api/admin/news"
    // Extrai o título do bloco de título
    const titleBlock = form.blocks.find(b => b.type === "title");
    const title = titleBlock ? titleBlock.value : "";
    const payload = {
      title,
      content: JSON.stringify(form.blocks),
      published: form.published,
      category: form.category || ""
    };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json()
      setError(err.error || "Erro ao salvar notícia")
      return
    }
    setForm({
      blocks: [
        { type: "image", value: "" },
        { type: "title", value: "" },
        { type: "paragraph", value: "" }
      ],
      published: false,
      category: ""
    })
    setEditing(null)
    fetchNews()
  }

  function handleBlockChange(idx, value) {
    setForm(f => ({ ...f, blocks: f.blocks.map((b, i) => i === idx ? { ...b, value } : b) }))
  }
  function handleBlockType(idx, type) {
    // Impede dois blocos do mesmo tipo seguidos
    setForm(f => {
      const prev = f.blocks[idx - 1]?.type;
      const next = f.blocks[idx + 1]?.type;
      if ((prev === type) || (next === type)) return f;
      return { ...f, blocks: f.blocks.map((b, i) => i === idx ? { ...b, type } : b) };
    })
  }
  function addBlock(type) {
    // Impede adicionar bloco igual ao anterior (mas não duplica)
    setForm(f => {
      if (f.blocks.length > 0 && f.blocks[f.blocks.length - 1].type === type) return f;
      return { ...f, blocks: [...f.blocks, { type, value: "" }] };
    })
  }
  function removeBlock(idx) {
    setForm(f => ({ ...f, blocks: f.blocks.filter((_, i) => i !== idx) }))
  }

  async function handleEdit(n) {
    let blocks = []
    try { blocks = JSON.parse(n.content) } catch { blocks = [{ type: "title", value: n.title || "" }, { type: "image", value: n.image || "" }, { type: "paragraph", value: n.content || "" }] }
    // Garante que o primeiro bloco é sempre título
    if (!blocks[0] || blocks[0].type !== "title") blocks = [{ type: "title", value: n.title || "" }, ...blocks]
    setForm({
      blocks,
      published: n.published,
      category: n.category || ""
    })
    setEditing(n)
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" })
    fetchNews()
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex gap-8 bg-zinc-900/80 rounded-2xl shadow-xl p-8 mt-6">
      {/* Coluna da lista de postagens */}
      <div className="w-2/5 pr-4 border-r border-zinc-800">
        <h2 className="text-xl font-bold mb-4 neon-text">Postagens Antigas</h2>
        <input
          className="input mb-2 w-full"
          placeholder="Filtrar postagens pelo título..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <select
          className="input mb-4 w-full"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas categorias</option>
          <option value="Games">Games</option>
          <option value="Cultura Geek">Cultura Geek</option>
          <option value="Filmes & Séries">Filmes & Séries</option>
          <option value="Anime">Anime</option>
        </select>
        {loading ? <div className="text-zinc-400">Carregando postagens...</div> : (
          <ul className="divide-y divide-zinc-800">
            {news.length === 0 && <li className="py-4 text-zinc-500 text-center">Nenhuma postagem cadastrada.</li>}
            {news
              .filter(n => {
                let blocks = [];
                try { blocks = JSON.parse(n.content) } catch { blocks = [{ type: "title", value: n.title || "" }, { type: "image", value: n.image || "" }, { type: "paragraph", value: n.content || "" }] }
                if (!blocks[0] || blocks[0].type !== "title") blocks = [{ type: "title", value: n.title || "" }, ...blocks];
                const title = (blocks[0]?.value || n.title || "").toLowerCase();
                // Filtro de título
                if (!title.includes(filter.toLowerCase())) return false;
                // Filtro de categoria (assunto)
                const cat = n.category || n.assunto || n.subject || "";
                if (categoryFilter && cat !== categoryFilter) return false;
                return true;
              })
              .map(n => {
                let blocks = []
                try { blocks = JSON.parse(n.content) } catch { blocks = [{ type: "title", value: n.title || "" }, { type: "image", value: n.image || "" }, { type: "paragraph", value: n.content || "" }] }
                if (!blocks[0] || blocks[0].type !== "title") blocks = [{ type: "title", value: n.title || "" }, ...blocks]
                // Preview: apenas imagem e título
                const imageBlock = blocks.find(b => b.type === "image" && b.value);
                return (
                  <li key={n.id} className="py-4 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-discord-neon text-lg">{blocks[0]?.value || n.title}</span>
                      <div className="flex gap-2">
                        <a className="btn-primary text-xs" href={`/noticias/${n.id}`} target="_blank" rel="noopener noreferrer">Ver</a>
                        <button className="btn-secondary text-xs" onClick={()=>handleEdit(n)}>Editar</button>
                        <button className="btn-secondary text-xs text-red-400" onClick={()=>handleDelete(n.id)}>Excluir</button>
                      </div>
                    </div>
                    <span className="text-zinc-300 text-sm">{n.author?.globalName || n.author?.email} | {new Date(n.createdAt).toLocaleDateString()}</span>
                    {imageBlock && <img src={imageBlock.value} alt="imagem" className="w-32 rounded mt-2" />}
                    <span className={`text-xs mt-1 ${n.published ? "text-green-400" : "text-yellow-400"}`}>{n.published ? "Publicada" : "Rascunho"}</span>
                  </li>
                )
              })}
          </ul>
        )}
      </div>
      {/* Coluna do formulário de criação/edição */}
      <div className="w-3/5 pl-8">
        <h2 className="text-xl font-bold mb-4 neon-text">Gerenciar Postagens</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-8">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Categoria</label>
            <select
              className="input w-full"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Games">Games</option>
              <option value="Cultura Geek">Cultura Geek</option>
              <option value="Filmes & Séries">Filmes & Séries</option>
              <option value="Anime">Anime</option>
            </select>
          </div>
          {form.blocks.map((block, idx) => (
            <div key={idx} className="relative mb-2">
              <button
                type="button"
                aria-label="Remover bloco"
                onClick={()=>removeBlock(idx)}
                disabled={form.blocks.length<=1}
                className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 text-lg font-bold bg-transparent border-none p-0 m-0 cursor-pointer z-10"
                style={{background:'none', border:'none'}}
              >
                ×
              </button>
              <div className="flex flex-col gap-2 bg-zinc-800/40 p-3 rounded-lg">
                {block.type === "title" ? (
                  <input className="input font-bold text-lg w-full" placeholder="Título da postagem" value={block.value} onChange={e=>handleBlockChange(idx, e.target.value)} />
                ) : block.type === "image" ? (
                  <input className="input w-full" placeholder="URL da imagem" value={block.value} onChange={e=>handleBlockChange(idx, e.target.value)} />
                ) : (
                  <textarea className="input w-full min-h-[120px] text-base" placeholder="Conteúdo do parágrafo" value={block.value} onChange={e=>handleBlockChange(idx, e.target.value)} rows={6} />
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-2 mb-4">
            <button type="button" className="btn-secondary text-base px-6 py-3" onClick={()=>addBlock("image")}>Adicionar Imagem</button>
            <button type="button" className="btn-secondary text-base px-6 py-3" onClick={()=>addBlock("title")}>Adicionar Título</button>
            <button type="button" className="btn-secondary text-base px-6 py-3" onClick={()=>addBlock("paragraph")}>Adicionar Parágrafo</button>
          </div>
          {/* Caixa publicada removida */}
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button className="btn-primary w-fit" type="submit">{editing ? "Salvar edição" : "Criar postagem"}</button>
          {editing && <button type="button" className="btn-secondary w-fit" onClick={()=>{
            setEditing(null);
            setForm({
              blocks: [
                { type: "image", value: "" },
                { type: "title", value: "" },
                { type: "paragraph", value: "" }
              ],
              published: false,
              category: ""
            });
          }}>Cancelar edição</button>}
        </form>
      </div>
    </div>
  )
}
