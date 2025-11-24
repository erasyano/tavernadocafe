"use client";
import FuturisticHeader from "../../../components/FuturisticHeader";
import DropdownCategorias from "../DropdownCategorias";
import PlaylistPanel from "../../../components/PlaylistPanel";
import VideoPlayer from "../../../components/VideoPlayer";
import LessonDetails from "../../../components/LessonDetails";

import { useParams } from "next/navigation";

import { useEffect, useState } from "react";

export default function CategoriaPage() {
  const params = useParams();
  const categoriaId = params?.categoria;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAula, setSelectedAula] = useState(null);

  useEffect(() => {
    fetch("/taverna-categories.json?" + Date.now())
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
      });
  }, []);

  useEffect(() => {
    if (categories.length) {
      const cat = categories.find(c => c.id === categoriaId) || categories[0];
      setSelectedCategory(cat);
      setSelectedAula(cat?.aulas?.[0] || null);
    }
  }, [categories, categoriaId]);

  const handleAulaSelect = (idx) => {
    setSelectedAula(selectedCategory.aulas[idx]);
  };

  if (!selectedCategory) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-white flex flex-col pt-16 md:pt-20">
      <div className="relative">
        <FuturisticHeader>
          <DropdownCategorias categories={categories} selectedCategory={selectedCategory.id} />
        </FuturisticHeader>
      </div>
      <main className="flex flex-1 w-full max-w-7xl mx-auto px-2 gap-8">
        <div className="flex-1 flex flex-col gap-6 rounded-2xl shadow-2xl border border-[#232b3e] p-6 my-6" style={{background:'#181c2b', backgroundColor:'#181c2b', opacity:1, zIndex:10, position:'relative'}}>
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => window.location.href = '/perfil/tavernaclass'} className="px-4 py-2 rounded-lg bg-[#00f2fe] text-black font-bold shadow hover:bg-[#4facfe] transition">INICIO</button>
            <h2 className="text-3xl font-bold text-neon-blue">{selectedCategory.name}</h2>
          </div>
          <div className="flex gap-6 flex-1">
            <aside className="w-64 flex-shrink-0 flex flex-col gap-2 border-r border-zinc-800 pr-4 mb-4 md:mb-0">
              <h3 className="font-bold text-neon-blue mb-2 text-base">Aulas/Playlists</h3>
              {(selectedCategory.aulas || []).map((aula, idx) => (
                <button
                  key={idx}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${selectedAula === aula ? 'bg-discord-blue/80 border-white text-white scale-105' : 'bg-zinc-800 border-transparent text-zinc-200 hover:bg-discord-blue/40'}`}
                  onClick={() => handleAulaSelect(idx)}
                  title={aula.titulo}
                >
                  {aula.titulo || `Aula ${idx+1}`}
                </button>
              ))}
            </aside>
            <div className="flex-1 flex flex-col gap-4">
              {selectedAula && <VideoPlayer youtubeId={selectedAula.youtubeId} />}
              {selectedAula && (
                <div className="bg-zinc-800/70 rounded-xl p-4 mt-2">
                  <h3 className="text-lg font-bold text-neon-blue mb-1">{selectedAula.titulo}</h3>
                  <p className="text-zinc-300 text-base whitespace-pre-line">{selectedAula.descricao}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
