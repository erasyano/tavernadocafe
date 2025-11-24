"use client"
import { useEffect, useRef } from 'react';
import HeroSection from './components/HeroSection'
import NoticiasHome from './components/NoticiasHome'
import SorteioPreview from './components/SorteioPreview'
import NeonStarsBackground from "./components/NeonStarsBackground";
import FloatingScrollButtons from "./components/FloatingScrollButtons";
import CarouselBlocks from "../components/CarouselBlocks";
// import DestaquesTavernaClass from "../components/DestaquesTavernaClass";
export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#23242b]">
      <NeonStarsBackground />
      <div className="relative z-10">
        <HeroSection />
        {/* Tarja preta translúcida entre os blocos de stats e as notícias */}
        <div className="w-full flex items-center justify-center my-8 relative min-h-[180px] md:min-h-[220px]">
          {/* Fundo translúcido da tarja */}
          <div className="absolute inset-0 glass-effect rounded-2xl shadow-2xl z-0 pointer-events-none backdrop-blur-md" style={{background:'rgba(44,46,60,0.28)', WebkitBackdropFilter:'blur(18px) saturate(120%)', backdropFilter:'blur(18px) saturate(120%)'}} />
          <div className="flex w-full max-w-7xl items-center z-10 gap-4">
            {/* Todos os blocos em uma única linha, incluindo Roxo e Azul */}
            <div className="flex flex-row gap-6 flex-1 min-w-0 justify-center">
              <CarouselBlocks />
            </div>
          </div>
        </div>
        {/* <DestaquesTavernaClass /> */}
        <NoticiasHome />
        {/* Botão flutuante para subir/descer */}
        <FloatingScrollButtons />
      </div>
    </main>
  )
}
