import { useState, useEffect } from "react";

export default function DestaquesAdmin({ destaques, setDestaques, onSave, saving, error, success }) {
  const [selected, setSelected] = useState(0);

  function handleChange(field, value) {
    setDestaques((prev) => {
      if (!prev[selected]) return prev;
      const copy = [...prev];
      copy[selected] = { ...copy[selected], [field]: value };
      return copy;
    });
  }

  function handleRemove(idx) {
    setDestaques((prev) => prev.filter((_, i) => i !== idx));
    setSelected((prevSelected) => {
      if (idx === prevSelected && prevSelected > 0) return prevSelected - 1;
      if (prevSelected >= destaques.length - 1) return Math.max(0, destaques.length - 2);
      return prevSelected;
    });
  }

  return (
    <div className="w-full flex gap-8">
      {/* Lateral: lista de destaques */}
      <aside className="w-48 flex flex-col gap-3">
        {destaques.map((d, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-1">
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-bold border-2 transition-all text-left ${selected === idx ? 'bg-discord-blue/80 border-white text-white scale-105' : 'bg-zinc-800 border-transparent text-zinc-200 hover:bg-discord-blue/40'}`}
              onClick={() => setSelected(idx)}
            >
              {d.titulo || `Destaque ${idx+1}`}
            </button>
            <button
              className="ml-1 px-2 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-800 transition"
              title="Remover destaque"
              onClick={() => handleRemove(idx)}
            >✕</button>
          </div>
        ))}
        <button className="btn-primary mt-4" onClick={() => setDestaques([...destaques, { titulo: '', imagem: '', url: '' }])}>Adicionar Destaque</button>
      </aside>
      {/* Centro: editor do destaque selecionado */}
      <section className="flex-1 rounded-lg p-6 bg-zinc-900/60 flex flex-col gap-2 min-w-[320px]">
        {destaques[selected] && (
          <>
            <div className="mb-2 font-semibold text-lg">{destaques[selected]?.titulo || `Destaque ${selected+1}`}</div>
            <input
              className="input w-full mb-2"
              placeholder="Título"
              value={destaques[selected]?.titulo || ''}
              onChange={e => handleChange('titulo', e.target.value)}
            />
            <input
              className="input w-full mb-2"
              placeholder="URL da Imagem"
              value={destaques[selected]?.imagem || ''}
              onChange={e => handleChange('imagem', e.target.value)}
            />
            <input
              className="input w-full mb-2"
              placeholder="URL de direcionamento"
              value={destaques[selected]?.url || ''}
              onChange={e => handleChange('url', e.target.value)}
            />
            {destaques[selected]?.imagem && (
              <img src={destaques[selected].imagem} alt="Pré-visualização" className="w-48 h-28 object-cover rounded border border-zinc-300" />
            )}
          </>
        )}
        <button className="btn-primary mt-4 w-fit" onClick={onSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </section>
    </div>
  );
}
