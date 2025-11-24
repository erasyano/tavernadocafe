// FloatingScrollButtons.jsx
'use client';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function FloatingScrollButtons() {
  return (
    <div className="fixed right-6 bottom-8 z-[1000] flex flex-col gap-5">
      <button
        aria-label="Subir para o topo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#23242b] via-[#a259f7] to-[#4d8cff] shadow-[0_0_24px_6px_rgba(162,89,247,0.25)] flex items-center justify-center text-white text-2xl font-extrabold border-2 border-white/10 hover:scale-110 hover:shadow-[0_0_32px_12px_rgba(162,89,247,0.4)] transition-all duration-200 backdrop-blur-md group"
        style={{ outline: 'none', backdropFilter: 'blur(8px) saturate(120%)' }}
      >
        <ArrowUp className="w-7 h-7 group-hover:animate-bounce" />
      </button>
      <button
        aria-label="Descer para o final"
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#23242b] via-[#4d8cff] to-[#a259f7] shadow-[0_0_24px_6px_rgba(77,140,255,0.25)] flex items-center justify-center text-white text-2xl font-extrabold border-2 border-white/10 hover:scale-110 hover:shadow-[0_0_32px_12px_rgba(77,140,255,0.4)] transition-all duration-200 backdrop-blur-md group"
        style={{ outline: 'none', backdropFilter: 'blur(8px) saturate(120%)' }}
      >
        <ArrowDown className="w-7 h-7 group-hover:animate-bounce" />
      </button>
    </div>
  );
}