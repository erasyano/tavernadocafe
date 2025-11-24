import { useEffect, useState } from "react";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selected, setSelected] = useState(0);
  const [selectedAula, setSelectedAula] = useState(0);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      });
  }, []);

  function handleCategoryChange(idx, field, value) {
    setCategories(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  function handleRemoveCategory(idx) {
    setCategories(prev => prev.filter((_, i) => i !== idx));
    setSelected(s => (s > 0 ? s - 1 : 0));
  }

  function handleAddCategory() {
    setCategories(prev => [...prev, { id: '', name: '', aulas: [] }]);
    setSelected(categories.length);
  }

  function handleAddAula(catIdx) {
    setCategories(prev => {
      const copy = [...prev];
      copy[catIdx].aulas = [...(copy[catIdx].aulas || []), { titulo: '', descricao: '', youtubeId: '' }];
      return copy;
    });
  }

  function handleAulaChange(catIdx, aulaIdx, field, value) {
    setCategories(prev => {
      const copy = [...prev];
      const aulas = [...(copy[catIdx].aulas || [])];
      aulas[aulaIdx] = { ...aulas[aulaIdx], [field]: value };
      copy[catIdx].aulas = aulas;
      return copy;
    });
  }

  function handleRemoveAula(catIdx, aulaIdx) {
    setCategories(prev => {
      const copy = [...prev];
      copy[catIdx].aulas = copy[catIdx].aulas.filter((_, i) => i !== aulaIdx);
      return copy;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Categorias salvas!");
    } catch {
      setError("Erro ao salvar categorias.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-zinc-400">Carregando categorias...</div>;

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-extrabold text-neon-blue mb-2">Gerenciar Categorias do Taverna Class</h2>
      <p className="text-zinc-300 mb-4 max-w-2xl">Aqui você pode criar, editar e remover as categorias (jogos) do Taverna Class. Cada categoria representa um jogo ou tema, e dentro de cada uma você pode cadastrar as aulas/playlists, informando o título, descrição e o vídeo do YouTube correspondente.</p>
      <div className="flex gap-4 mb-4 flex-wrap">
        {categories.map((cat, idx) => (
          <button
            key={cat.id || idx}
            className={`px-4 py-2 rounded-lg font-bold border-2 transition-all ${selected === idx ? 'bg-discord-blue/80 border-white text-white scale-105' : 'bg-zinc-800 border-transparent text-zinc-200 hover:bg-discord-blue/40'}`}
            onClick={() => setSelected(idx)}
            title={cat.name || `Categoria ${idx+1}`}
          >
            {cat.name || `Categoria ${idx+1}`}
          </button>
        ))}
        <button className="btn-primary" onClick={handleAddCategory}>+ Nova Categoria</button>
      </div>
      {categories[selected] && (
        <section className="flex flex-col md:flex-row gap-8 bg-zinc-900/60 rounded-lg p-6 max-w-5xl">
          {/* Coluna lateral: lista de aulas/playlists */}
          <aside className="w-full md:w-56 flex-shrink-0 flex flex-col gap-2 border-r border-zinc-800 pr-4 mb-4 md:mb-0">
            <h3 className="font-bold text-neon-blue mb-2 text-base">Aulas/Playlists</h3>
            <p className="text-zinc-400 text-xs mb-2">Clique para editar uma aula/playlist.</p>
            {(categories[selected].aulas || []).map((aula, aulaIdx) => (
              <button
                key={aulaIdx}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${selectedAula === aulaIdx ? 'bg-discord-blue/80 border-white text-white scale-105' : 'bg-zinc-800 border-transparent text-zinc-200 hover:bg-discord-blue/40'}`}
                onClick={() => setSelectedAula(aulaIdx)}
                title={aula.titulo}
              >
                {aula.titulo || `Aula ${aulaIdx+1}`}
              </button>
            ))}
            <button className="btn-secondary mt-2 w-full" onClick={() => { handleAddAula(selected); setSelectedAula((categories[selected].aulas||[]).length); }}>+ Nova Aula/Playlist</button>
          </aside>
          {/* Coluna principal: edição da categoria e da aula selecionada */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm text-zinc-300 mb-1">ID da Categoria <span className="text-xs text-zinc-400">(ex: albion, minecraft)</span></label>
                <input
                  className="input w-full mb-2"
                  placeholder="ID único (ex: albion)"
                  value={categories[selected].id}
                  onChange={e => handleCategoryChange(selected, 'id', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-zinc-300 mb-1">Nome da Categoria <span className="text-xs text-zinc-400">(ex: Albion Online)</span></label>
                <input
                  className="input w-full mb-2"
                  placeholder="Nome da Categoria"
                  value={categories[selected].name}
                  onChange={e => handleCategoryChange(selected, 'name', e.target.value)}
                />
              </div>
              <button className="ml-2 px-2 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-800 transition self-end" title="Remover categoria" onClick={() => handleRemoveCategory(selected)}>✕</button>
            </div>
            {/* Formulário de edição da aula/playlists selecionada */}
            {(categories[selected].aulas && categories[selected].aulas[selectedAula]) && (
              <div className="flex flex-col gap-2 bg-zinc-800/60 rounded p-4 border border-zinc-700">
                <label className="block text-xs text-zinc-400 mb-0.5">Título da Aula</label>
                <input
                  className="input mb-1"
                  placeholder="Título da aula"
                  value={categories[selected].aulas[selectedAula].titulo}
                  onChange={e => handleAulaChange(selected, selectedAula, 'titulo', e.target.value)}
                />
                <label className="block text-xs text-zinc-400 mb-0.5">Descrição</label>
                <input
                  className="input mb-1"
                  placeholder="Descrição da aula"
                  value={categories[selected].aulas[selectedAula].descricao}
                  onChange={e => handleAulaChange(selected, selectedAula, 'descricao', e.target.value)}
                />
                <label className="block text-xs text-zinc-400 mb-0.5">YouTube ID do vídeo</label>
                <input
                  className="input mb-1"
                  placeholder="ID do vídeo do YouTube (ex: dQw4w9WgXcQ)"
                  value={categories[selected].aulas[selectedAula].youtubeId}
                  onChange={e => handleAulaChange(selected, selectedAula, 'youtubeId', e.target.value)}
                />
                <button className="ml-2 mt-2 px-2 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-800 transition self-start" title="Remover aula" onClick={() => { handleRemoveAula(selected, selectedAula); setSelectedAula(0); }}>Remover Aula</button>
              </div>
            )}
          </div>
        </section>
      )}
      <button className="btn-primary mt-6 w-fit" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar Categorias"}</button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
}
