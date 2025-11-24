import { useEffect, useState, useRef } from "react";

export default function BannerCarousel({ visible = 5 }) {
  const [destaques, setDestaques] = useState([]);
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("/carousel-blocks.json?" + Date.now())
      .then(res => res.json())
      .then(data => setDestaques(data.destaques || []));
  }, []);

  if (!destaques.length) return null;

  const maxIndex = Math.max(0, destaques.length - visible);

  function prev() {
    setCurrent((c) => Math.max(0, c - 1));
  }
  function next() {
    setCurrent((c) => Math.min(maxIndex, c + 1));
  }

  // Centralização
  const totalWidth = visible * 220 + (visible - 1) * 32; // 220px card + 32px gap
  // Centralizar sempre 5 visíveis
  const totalVisible = Math.min(visible, destaques.length);
  const layoutWidth = totalVisible * 220 + (totalVisible - 1) * 32;
  const containerWidth = destaques.length * 220 + (destaques.length - 1) * 32;
  let offset = current * 252;
  // Centraliza o grupo visível
  let marginLeft = 0;
  if (containerWidth < layoutWidth) {
    marginLeft = (layoutWidth - containerWidth) / 2;
    offset = 0;
  }

  const slideStyle = {
    transform: `translateX(-${offset}px)`,
    transition: 'transform 0.5s cubic-bezier(.77,0,.18,1)',
    width: containerWidth,
    marginLeft,
    marginRight: 0,
    display: 'flex',
    gap: '32px',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minWidth: layoutWidth,
    maxWidth: layoutWidth,
  };

  return (
    <div className="w-full py-6 relative">
      <h3 className="text-xl font-bold text-white mb-4 ml-2">Destaques</h3>
      <div className="relative flex items-center justify-center">
        {current > 0 && (
          <button onClick={prev} className="absolute left-0 z-10 bg-zinc-900/80 hover:bg-discord-blue text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all border-2 border-[#232b3e] -ml-4">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
        )}
        <div className="overflow-hidden w-full flex justify-center">
          <div
            ref={containerRef}
            style={slideStyle}
          >
            {destaques.map((d, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[200px] max-w-[220px]" style={{zIndex: 2, padding: '0 12px'}}>
                <div
                  className="w-[180px] h-[260px] rounded-2xl border-2 border-[#232b3e] bg-zinc-900 mb-2 cursor-pointer group transition-all duration-300 hover:border-green-400 hover:border-[1.5px]"
                  style={{ boxShadow: 'none', overflow: 'visible' }}
                  onClick={() => d.url && window.open(d.url, '_blank')}
                >
                  <div className="relative w-full h-full" style={{overflow: 'visible'}}>
                    {d.imagem && <img src={d.imagem} alt={d.titulo} className="relative w-full h-full object-cover z-10 rounded-2xl" />}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <span className="text-white text-lg font-bold bg-black/60 px-3 py-2 rounded-xl shadow-lg border border-discord-neon">Ver mais</span>
                    </div>
                  </div>
                </div>
                <span className="font-bold text-base text-white text-center mt-1 drop-shadow-lg" title={d.titulo}>{d.titulo}</span>
              </div>
            ))}
          </div>
        </div>
        {current < maxIndex && (
          <button onClick={next} className="absolute right-0 z-10 bg-zinc-900/80 hover:bg-discord-blue text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all border-2 border-[#232b3e] -mr-4">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
