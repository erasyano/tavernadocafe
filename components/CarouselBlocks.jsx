import { useEffect, useState } from "react";

const COLORS = [
  { key: "vermelho", label: "Vermelho", color: "#ff4d4d" },
  { key: "verde", label: "Verde", color: "#4dff88" },
  { key: "amarelo", label: "Amarelo", color: "#ffe066" },
  { key: "laranja", label: "Laranja", color: "#ff9900" },
  { key: "roxo", label: "Roxo", color: "#a259f7" },
  { key: "azul", label: "Azul", color: "#4d8cff" },
];

export default function CarouselBlocks() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch("/carousel-blocks.json")
      .then((res) => res.json())
      .then((data) => {
        // Garante ordem das cores
        const blocks = (data.blocks || COLORS.map(c => ({ ...c, titulo: c.label, texto: `Conteúdo do bloco ${c.label.toLowerCase()}.`, imagem: "", url: "" })));
        const ordered = COLORS.map(c => blocks.find(b => b.key === c.key) || { ...c, titulo: c.label, texto: `Conteúdo do bloco ${c.label.toLowerCase()}.`, imagem: "", url: "" });
        setBlocks(ordered);
      });
  }, []);

  if (!blocks.length) return null;

  return blocks.map((block, idx) => {
    return (
      <div
        key={block.key}
        className="relative rounded-2xl shadow-xl h-56 flex flex-col items-start justify-end p-0 cursor-pointer transition-all duration-300 group hover:scale-105 gamer-block backdrop-blur-md overflow-hidden"
        style={{
          background: 'rgba(36,37,50,0.85)',
          boxShadow: `0 4px 32px 0 ${block.color}33`,
          border: `2px solid ${block.color}`,
          transform: 'skew(-12deg)',
          width: '224px',
          minWidth: '224px',
          maxWidth: '224px',
          flex: '0 0 224px',
          boxSizing: 'border-box',
          WebkitBoxSizing: 'border-box',
        }}
        onClick={() => {
          if (block.url) window.open(block.url, '_blank');
        }}
        title={block.url ? `Abrir: ${block.url}` : undefined}
      >
        {block.imagem && (
          <img src={block.imagem} alt="Imagem" className="absolute top-0 left-0 w-full h-2/3 object-cover z-0" style={{filter:'brightness(0.85)'}} />
        )}
        <div className="relative z-10 flex flex-col items-start justify-end h-full w-full p-7" style={{background: block.imagem ? 'linear-gradient(to top, rgba(36,37,50,0.92) 60%, rgba(36,37,50,0.2) 100%)' : undefined}}>
          <span className="text-2xl font-extrabold font-mono" style={{ color: block.color, transform: 'skew(12deg)' }}>{block.titulo}</span>
          <span className="text-base font-mono font-semibold leading-snug mt-2" style={{ color: '#fff', transform: 'skew(12deg)' }}>{block.texto}</span>
        </div>
        <div className="absolute inset-0 rounded-2xl pointer-events-none"></div>
      </div>
    );
  });
}
