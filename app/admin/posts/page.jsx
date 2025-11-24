"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

const categorias = [
  { key: 'Games', label: 'Games' },
  { key: 'Geek', label: 'Cultura Geek' },
  { key: 'Filmes', label: 'Filmes & Séries' },
  { key: 'Anime', label: 'Anime' },
]

export default function AdminPosts() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState("")
  // Editor de blocos: cada bloco é { tipo: 'texto'|'imagem', valor: string }
  const [contentBlocks, setContentBlocks] = useState([{ tipo: 'texto', valor: '' }])
  const [image, setImage] = useState("")
  const [categoria, setCategoria] = useState('Games')
  const [destaque, setDestaque] = useState(false)
  const [search, setSearch] = useState("")
  const router = useRouter()
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(data => {
      if (!data.authenticated || !data.user.isAdmin) {
        router.replace("/login")
      } else {
        setUser(data.user)
        setLoading(false)
      }
    })
    fetch("/api/noticias?page=1").then(res => res.json()).then(data => setPosts(data.noticias))
  }, [router])

  async function handleCreate(e) {
    e.preventDefault()
    // Monta conteúdo final como array de blocos
    const conteudo = JSON.stringify(contentBlocks)
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: title, conteudo, imagem: image, categoria, destaque })
    })
    if (res.ok) {
      setTitle("")
      setContentBlocks([{ tipo: 'texto', valor: '' }])
      setImage("")
      setCategoria('Games')
      setDestaque(false)
      // Atualiza lista
      fetch("/api/noticias?page=1").then(res => res.json()).then(data => setPosts(data.noticias))
    } else {
      alert("Erro ao criar postagem")
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir?")) return
    const res = await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      setPosts(posts => posts.filter(p => p.id !== id))
    } else {
      alert("Erro ao excluir postagem")
    }
  }

  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editBlocks, setEditBlocks] = useState([])
  const [editImage, setEditImage] = useState("")
  const [editCategoria, setEditCategoria] = useState('Games')
  const [editDestaque, setEditDestaque] = useState(false)

  function startEdit(post) {
    setEditId(post.id)
    setEditTitle(post.titulo)
    let blocks = []
    try {
      blocks = Array.isArray(JSON.parse(post.conteudo)) ? JSON.parse(post.conteudo) : [{ tipo: 'texto', valor: post.conteudo }]
    } catch {
      blocks = [{ tipo: 'texto', valor: post.conteudo }]
    }
    setEditBlocks(blocks)
    setEditImage(post.imagem || "")
    setEditCategoria(post.categoria || 'Games')
    setEditDestaque(!!post.destaque)
  }

  async function handleEdit(e) {
    e.preventDefault()
    const conteudo = JSON.stringify(editBlocks)
    const res = await fetch("/api/admin/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, titulo: editTitle, conteudo, imagem: editImage, categoria: editCategoria, destaque: editDestaque })
    })
    if (res.ok) {
      setEditId(null)
      fetch("/api/noticias?page=1").then(res => res.json()).then(data => setPosts(data.noticias))
    } else {
      alert("Erro ao editar postagem")
    }
  }

  if (loading) return <div className="text-center py-20 text-zinc-400">Carregando...</div>

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold neon-text mb-6">Gerenciar Postagens</h1>
      {/* Exibe Postagens Existentes e Nova Postagem lado a lado */}
      <div className="flex flex-row gap-8 items-start">
        <div className="w-full max-w-xs">
          <h2 className="text-lg font-semibold mb-2">Postagens Existentes</h2>
          <input
            type="text"
            className="input mb-3"
            placeholder="Buscar por título..."
            value={search || ''}
            onChange={e => setSearch(e.target.value)}
          />
          <ul className="divide-y divide-zinc-800 max-h-[70vh] overflow-y-auto">
            {posts
              .filter(post => !search || post.titulo.toLowerCase().includes(search.toLowerCase()))
              .map(post => (
                <li key={post.id} className="py-3 flex gap-2 items-center">
                  <img src={post.imagem} alt="imagem" className="w-12 h-12 object-cover rounded-lg border border-zinc-800" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-zinc-200 truncate">{post.titulo}</div>
                  </div>
                  <a
                    className="btn-primary px-2 py-1 text-xs"
                    href={`/noticias/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >Ver</a>
                  <button className="btn-secondary px-2 py-1 text-xs" onClick={() => startEdit(post)}>Editar</button>
                  <button className="btn-danger px-2 py-1 text-xs" onClick={() => handleDelete(post.id)}>Excluir</button>
                </li>
              ))}
          </ul>
        </div>
        {editId === null ? (
          <form onSubmit={handleCreate} className="bg-zinc-900/80 rounded-xl p-6 flex-1 flex flex-col gap-4 shadow-lg min-w-[480px] max-w-[900px] w-full">
            <h2 className="text-lg font-semibold mb-2">Nova Postagem</h2>
            <input className="input" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
            <div className="flex gap-2 items-center">
              <input className="input flex-1" placeholder="URL da Imagem de capa (opcional)" value={image} onChange={e => setImage(e.target.value)} />
              <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={async e => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/admin/posts/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.url) setImage(data.url);
              }} />
              <button type="button" className="btn-secondary" onClick={() => fileInputRef.current && fileInputRef.current.click()}>Upload</button>
            </div>
            {image && <img src={image} alt="preview" className="w-32 h-20 object-cover rounded border border-zinc-700 mb-2" />}
            {/* Editor de blocos */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Conteúdo</label>
              {contentBlocks.map((block, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  {block.tipo === 'texto' ? (
                    <textarea
                      className="input flex-1"
                      placeholder={`Parágrafo ${idx + 1}`}
                      value={block.valor}
                      rows={12}
                      onChange={e => {
                        const newBlocks = [...contentBlocks]
                        newBlocks[idx].valor = e.target.value
                        setContentBlocks(newBlocks)
                      }}
                    />
                  ) : (
                    <input
                      className="input flex-1"
                      placeholder="URL da Imagem"
                      value={block.valor}
                      onChange={e => {
                        const newBlocks = [...contentBlocks]
                        newBlocks[idx].valor = e.target.value
                        setContentBlocks(newBlocks)
                      }}
                    />
                  )}
                  <button type="button" className="btn-danger px-2 py-1 text-xs" onClick={() => setContentBlocks(blocks => blocks.length === 1 ? blocks : blocks.filter((_, i) => i !== idx))}>✕</button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button type="button" className="btn-secondary px-3 py-1 text-xs" onClick={() => setContentBlocks(blocks => [...blocks, { tipo: 'texto', valor: '' }])}>+ Parágrafo</button>
                <button type="button" className="btn-secondary px-3 py-1 text-xs" onClick={() => setContentBlocks(blocks => [...blocks, { tipo: 'imagem', valor: '' }])}>+ Imagem</button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Categoria</label>
                <select className="input" value={categoria} onChange={e => setCategoria(e.target.value)}>
                  {categorias.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <input type="checkbox" id="destaque" checked={destaque} onChange={e => setDestaque(e.target.checked)} />
                <label htmlFor="destaque" className="font-semibold">Destaque (aparece no início)</label>
              </div>
            </div>
            <button type="submit" className="btn-primary mt-4">Criar Postagem</button>
          </form>
          ) : (
            <form onSubmit={handleEdit} className="bg-zinc-900/80 rounded-xl p-6 flex-1 flex flex-col gap-4 shadow-lg min-w-[480px] max-w-[900px] w-full">
              <h2 className="text-lg font-semibold mb-2">Editar Postagem</h2>
              <input className="input" placeholder="Título" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
              <div className="flex gap-2 items-center">
                <input className="input flex-1" placeholder="URL da Imagem de capa (opcional)" value={editImage} onChange={e => setEditImage(e.target.value)} />
                <input type="file" accept="image/*" ref={editFileInputRef} style={{ display: 'none' }} onChange={async e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('file', file);
                  const res = await fetch('/api/admin/posts/upload', { method: 'POST', body: formData });
                  const data = await res.json();
                  if (data.url) setEditImage(data.url);
                }} />
                <button type="button" className="btn-secondary" onClick={() => editFileInputRef.current && editFileInputRef.current.click()}>Upload</button>
              </div>
              {editImage && <img src={editImage} alt="preview" className="w-32 h-20 object-cover rounded border border-zinc-700 mb-2" />}
              {/* Editor de blocos para edição */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Conteúdo</label>
                {editBlocks.map((block, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    {block.tipo === 'texto' ? (
                      <textarea
                        className="input flex-1"
                        placeholder={`Parágrafo ${idx + 1}`}
                        value={block.valor}
                        rows={12}
                        onChange={e => {
                          const newBlocks = [...editBlocks]
                          newBlocks[idx].valor = e.target.value
                          setEditBlocks(newBlocks)
                        }}
                      />
                    ) : (
                      <input
                        className="input flex-1"
                        placeholder="URL da Imagem"
                        value={block.valor}
                        onChange={e => {
                          const newBlocks = [...editBlocks]
                          newBlocks[idx].valor = e.target.value
                          setEditBlocks(newBlocks)
                        }}
                      />
                    )}
                    <button type="button" className="btn-danger px-2 py-1 text-xs" onClick={() => setEditBlocks(blocks => blocks.length === 1 ? blocks : blocks.filter((_, i) => i !== idx))}>✕</button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <button type="button" className="btn-secondary px-3 py-1 text-xs" onClick={() => setEditBlocks(blocks => [...blocks, { tipo: 'texto', valor: '' }])}>+ Parágrafo</button>
                  <button type="button" className="btn-secondary px-3 py-1 text-xs" onClick={() => setEditBlocks(blocks => [...blocks, { tipo: 'imagem', valor: '' }])}>+ Imagem</button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Categoria</label>
                  <select className="input" value={editCategoria} onChange={e => setEditCategoria(e.target.value)}>
                    {categorias.map(cat => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <input type="checkbox" id="edit-destaque" checked={editDestaque} onChange={e => setEditDestaque(e.target.checked)} />
                  <label htmlFor="edit-destaque" className="font-semibold">Destaque (aparece no início)</label>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn-primary flex-1">Salvar Alterações</button>
                <button type="button" className="btn-secondary flex-1" onClick={() => setEditId(null)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
"      </div>"
"    </div>"
"  );"
"}"
