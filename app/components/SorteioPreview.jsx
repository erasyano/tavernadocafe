
import { useState, useEffect } from "react";

export default function SorteioPreview() {
  const [sorteio, setSorteio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSorteio() {
      setLoading(true);
      try {
        const res = await fetch("/api/sorteios");
        const data = await res.json();
        // Pega o sorteio ativo mais próximo do fim
        const ativos = (data.sorteios || []).filter(s => s.ativo);
        if (ativos.length > 0) {
          ativos.sort((a, b) => new Date(a.dataFim) - new Date(b.dataFim));
          setSorteio(ativos[0]);
        } else {
          setSorteio(null);
        }
      } catch {
        setSorteio(null);
      }
      setLoading(false);
    }
    fetchSorteio();
  }, []);

  if (loading || !sorteio) return null;

  return (
    <div className="w-full h-full flex flex-col items-start justify-center">
      <div className="relative bg-[#181824] rounded-2xl shadow-2xl border-2 border-discord-neon p-5 w-full max-w-xs neon-text animate-fade-in" style={{backgroundColor:'#181824', opacity: 1}}>
        <div className="absolute -top-3 -left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 animate-pulse">🔥 Sorteio Ativo</div>
        <div className="flex flex-col items-center gap-3 mt-4">
          <h3 className="text-xl font-extrabold text-white text-center leading-tight mb-1 drop-shadow-lg">{sorteio.titulo}</h3>
          {sorteio.imagemUrl && (
            <img
              src={sorteio.imagemUrl}
              alt="Imagem do Sorteio"
              className="w-28 h-28 object-cover rounded-xl border-2 border-discord-neon shadow-lg mb-2 animate-glow"
              style={{boxShadow:'0 0 16px #a259f7, 0 2px 8px #000a'}}
            />
          )}
          <p className="text-sm text-gray-200 text-center font-medium px-2 mb-1" style={{textShadow:'0 1px 4px #000a'}}>{sorteio.descricao}</p>
          <div className="w-full flex flex-row items-center justify-center gap-2 mb-1">
            <span className="text-xs font-bold text-green-300 bg-green-900/40 px-2 py-0.5 rounded-full shadow border border-green-400/30 animate-pulse">🎁 Prêmio: {sorteio.premio}</span>
          </div>
          <div className="text-zinc-100 text-[12px] mb-1 font-semibold tracking-wide">Encerra em: <span className="text-yellow-300">{new Date(sorteio.dataFim).toLocaleDateString()}</span></div>
          <button className="w-full py-2 mt-1 rounded-lg font-bold text-base bg-gradient-to-r from-green-400 via-discord-neon to-discord-blue text-white shadow-lg hover:scale-105 hover:from-green-300 hover:to-discord-purple transition-all duration-300 animate-bounce">Participar Agora</button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    async function fetchSorteio() {
      setLoading(true);
      try {
        const res = await fetch("/api/sorteios");
        const data = await res.json();
        // Pega o sorteio ativo mais próximo do fim
        const ativos = (data.sorteios || []).filter(s => s.ativo);
        if (ativos.length > 0) {
          ativos.sort((a, b) => new Date(a.dataFim) - new Date(b.dataFim));
          setSorteio(ativos[0]);
        } else {
          setSorteio(null);
        }
      } catch {
        setSorteio(null);
      }
      setLoading(false);
    }
    fetchSorteio();

    // Efeito para seguir o scroll
    // Desabilita o efeito de seguir o scroll, fixa abaixo da linha vermelha
    setTop(800);
  }, []);

  if (loading) return null;
  if (!sorteio) return null;

  // Ajuste: posicionamento exato na área vermelha à esquerda do título principal
  return (
    <div
      className="absolute left-0 -top-10 z-30 w-[250px] max-w-[90vw] bg-gradient-to-br from-discord-purple/90 to-discord-blue/90 border-2 border-discord-neon rounded-2xl shadow-xl p-3 animate-fade-in flex flex-col items-center gap-2 neon-text glow-on-hover"
      style={{ boxShadow: '0 4px 24px 0 #a259f7cc, 0 1.5px 0 #fff8' }}
    >
      <div className="w-full flex flex-col items-center">
        <div className="text-[11px] uppercase tracking-widest font-bold text-white/80 mb-1 drop-shadow">🔥 Sorteio Ativo</div>
        {sorteio.imagemUrl && (
          <div className="relative mb-1">
            <img src={sorteio.imagemUrl} alt="Sorteio" className="w-20 h-20 object-cover rounded-xl shadow border-2 border-white/10" style={{filter:'drop-shadow(0 0 8px #a259f7cc)'}} />
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">Ativo</div>
          </div>
        )}
      </div>
      <div className="text-lg font-extrabold text-white text-center mb-1 drop-shadow-lg leading-tight">{sorteio.titulo}</div>
      <div className="text-zinc-200 text-xs text-center mb-1 font-medium px-1" style={{textShadow:'0 1px 4px #000a'}}>{sorteio.descricao}</div>
      <div className="w-full flex flex-row items-center justify-center gap-1 mb-1">
        <span className="text-xs font-bold text-green-300 bg-green-900/40 px-2 py-0.5 rounded-full shadow border border-green-400/30 animate-pulse">🎁 Prêmio: {sorteio.premio}</span>
      </div>
      <div className="text-zinc-100 text-[11px] mb-1 font-semibold tracking-wide">Encerra em: <span className="text-yellow-300">{new Date(sorteio.dataFim).toLocaleDateString()}</span></div>
      <button className="w-full py-2 mt-1 rounded-lg font-bold text-base bg-gradient-to-r from-green-400 via-discord-neon to-discord-blue text-white shadow hover:scale-105 hover:from-green-300 hover:to-discord-purple transition-all duration-300">Participar Agora</button>
    </div>
  );
}
