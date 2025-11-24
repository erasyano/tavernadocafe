import { useState, useEffect } from "react";
import DestaquesAdmin from "./DestaquesAdmin.jsx";

// Novo: estado para o vídeo inicial
import { useRef } from "react";

export default function CarouselAdmin() {

const COLORS = [
  { key: "vermelho", label: "Vermelho", color: "bg-red-500" },
  { key: "verde", label: "Verde", color: "bg-green-500" },
  { key: "amarelo", label: "Amarelo", color: "bg-yellow-400" },
  { key: "laranja", label: "Laranja", color: "bg-orange-400" },
  { key: "roxo", label: "Roxo", color: "bg-purple-500" },
  { key: "azul", label: "Azul", color: "bg-blue-500" },
];

  const [blocks, setBlocks] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState("");
  const [videoError, setVideoError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selected, setSelected] = useState(0);
  const [menu, setMenu] = useState("blocos");

  useEffect(() => {
    fetch("/api/admin/carousel")
      .then((res) => res.json())
      .then((data) => {
        // Garante que os blocos estejam na ordem das cores
        const blocks = (data.blocks || COLORS.map(c => ({ ...c, titulo: "", texto: "", imagem: "", url: "" })));
        const ordered = COLORS.map(c => blocks.find(b => b.key === c.key) || { ...c, titulo: "", texto: "", imagem: "", url: "" });
        setBlocks(ordered);
        setDestaques(data.destaques || []);
        setVideoId(data.videoId || "");
        setVideoInput(data.videoId || "");
        setLoading(false);
      })
      .catch(() => {
        setBlocks(COLORS.map(c => ({ ...c, titulo: "", texto: "", imagem: "", url: "" })));
        setDestaques([]);
        setLoading(false);
      });
  }, []);

  function handleChange(field, value) {
    setBlocks((prev) => {
      const copy = [...prev];
      copy[selected][field] = value;
      return copy;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Limpa blocos antigos: só mantém blocos preenchidos
      const cleanBlocks = blocks.filter(b => b.titulo || b.texto || b.imagem || b.url);
      // Limpa destaques antigos: só mantém destaques preenchidos
      const cleanDestaques = destaques.filter(d => d.titulo || d.imagem || d.url);
      const res = await fetch("/api/admin/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: cleanBlocks, destaques: cleanDestaques, videoId }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setSuccess("Salvo com sucesso!");
    } catch (e) {
      setError("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  // Função para extrair o ID do vídeo do link ou do próprio ID
  function extractYouTubeId(input) {
    if (!input) return "";
    // Se for só o ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    // Se for link completo
    const match = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    // Se for link encurtado
    const short = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (short) return short[1];
    return "";
  }

  async function handleSaveVideo() {
    setSavingVideo(true);
    setVideoError("");
    setVideoSuccess("");
    const id = extractYouTubeId(videoInput);
    if (!id) {
      setVideoError("Insira um link ou ID de vídeo válido.");
      setSavingVideo(false);
      return;
    }
    try {
      // Busca os dados mais recentes antes de salvar
      const latest = await fetch("/api/admin/carousel").then(r => r.json());
      const res = await fetch("/api/admin/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: latest.blocks || [],
          destaques: latest.destaques || [],
          videoId: id
        }),
      });
      if (!res.ok) throw new Error();
      setVideoId(id);
      setVideoSuccess("Vídeo salvo como inicial!");
    } catch {
      setVideoError("Erro ao salvar vídeo.");
    } finally {
      setSavingVideo(false);
    }
  }

  if (loading) return <div className="text-zinc-400">Carregando blocos...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <nav className="flex gap-4 mb-4">
        <button className={`btn-secondary ${menu === 'blocos' ? 'bg-discord-neon/20 text-discord-neon font-bold' : ''}`} onClick={() => setMenu('blocos')}>Blocos Coloridos</button>
        <button className={`btn-secondary ${menu === 'destaques' ? 'bg-discord-neon/20 text-discord-neon font-bold' : ''}`} onClick={() => setMenu('destaques')}>Destaques Taverna Class</button>
      </nav>


      {menu === 'blocos' && (
        <div className="flex gap-8">
          {/* Lateral: lista de blocos */}
          <aside className="w-48 flex flex-col gap-3">
            {blocks.map((block, idx) => (
              <button
                key={block.key}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold border-2 transition-all ${block.color} ${selected === idx ? 'bg-opacity-80 border-white text-white scale-105' : 'bg-opacity-30 border-transparent text-zinc-200 hover:bg-opacity-60'}`}
                style={{ backgroundColor: undefined }}
                onClick={() => setSelected(idx)}
              >
                <span className="w-3 h-3 rounded-full mr-2" style={{ background: block.color.replace('bg-', '').replace('-500', '') }}></span>
                {block.label}
              </button>
            ))}
          </aside>
          {/* Centro: editor do bloco selecionado */}
          <section className={`flex-1 rounded-lg p-6 ${blocks[selected].color} bg-opacity-20 flex flex-col gap-2 min-w-[320px]`}> 
            <div className="mb-2 font-semibold text-lg">{blocks[selected].label}</div>
            <input
              className="input w-full mb-2"
              placeholder="Título"
              value={blocks[selected].titulo}
              onChange={e => handleChange("titulo", e.target.value)}
            />
            <textarea
              className="input w-full mb-2"
              placeholder="Texto"
              value={blocks[selected].texto}
              onChange={e => handleChange("texto", e.target.value)}
              rows={2}
            />
            <input
              className="input w-full mb-2"
              placeholder="URL da Imagem (opcional)"
              value={blocks[selected].imagem || ""}
              onChange={e => handleChange("imagem", e.target.value)}
            />
            <input
              className="input w-full mb-2"
              placeholder="URL de direcionamento (opcional)"
              value={blocks[selected].url || ""}
              onChange={e => handleChange("url", e.target.value)}
            />
            {blocks[selected].imagem && (
              <img src={blocks[selected].imagem} alt="Pré-visualização" className="w-48 h-28 object-cover rounded border border-zinc-300" />
            )}
            <button className="btn-primary mt-4 w-fit" onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-500 mt-2">{success}</div>}
          </section>
        </div>
      )}
      {menu === 'destaques' && (
        <div className="flex flex-col gap-6">
          <div className="mb-4">
            <label className="block font-bold mb-1 text-neon-blue">YouTube ID do vídeo inicial do Taverna Class</label>
            <input
              className="input w-full max-w-xs"
              placeholder="Cole o link ou ID do vídeo"
              value={videoInput}
              onChange={e => setVideoInput(e.target.value)}
            />
            <button className="btn-primary mt-2" onClick={handleSaveVideo} disabled={savingVideo}>{savingVideo ? "Salvando..." : "Salvar vídeo inicial"}</button>
            <div className="mt-2">
              {extractYouTubeId(videoInput) && (
                <iframe
                  className="rounded-xl border border-discord-neon"
                  width="320"
                  height="180"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(videoInput)}`}
                  title="Pré-visualização do vídeo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
              {videoError && <div className="text-red-500 mt-2">{videoError}</div>}
              {videoSuccess && <div className="text-green-500 mt-2">{videoSuccess}</div>}
            </div>
          </div>
          <DestaquesAdmin
            destaques={destaques}
            setDestaques={setDestaques}
            onSave={handleSave}
            saving={saving}
            error={error}
            success={success}
          />
        </div>
      )}
    </div>
  );
}
