import { useEffect, useState } from "react";

export default function BannerCarousel() {
  const [destaques, setDestaques] = useState([]);

  useEffect(() => {
    fetch("/carousel-blocks.json")
      .then(res => res.json())
      .then(data => setDestaques(data.destaques || []));
  }, []);

  if (!destaques.length) return null;

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-white">Destaques</h2>
      <div className="flex flex-row gap-6 flex-wrap justify-start">
        {destaques.map((d, idx) => (
          <div key={idx} className="bg-zinc-900/80 rounded-xl shadow-lg flex flex-col items-center w-48 min-w-[180px] max-w-[200px] p-3 hover:scale-105 transition cursor-pointer border border-zinc-800" onClick={() => d.url && window.open(d.url, '_blank')}>
            {d.imagem && <img src={d.imagem} alt={d.titulo} className="w-full h-40 object-cover rounded-t-lg mb-2 bg-zinc-800" />}
            <div className="font-bold text-base text-white text-center truncate w-full" title={d.titulo}>{d.titulo}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
