'use client'

import GameOffersPanel from '../components/GameOffersPanel'
import FloatingScrollButtons from '../components/FloatingScrollButtons'

export default function JogosPage() {
  return (
    <div className="pt-24 min-h-screen bg-discord-dark">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 z-10 relative bg-zinc-900/80 rounded-2xl shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 neon-text">Ofertas de Jogos</h1>
        <p className="text-gray-300 mb-8 text-lg max-w-2xl">Confira abaixo as melhores promoções e descontos em jogos digitais das principais lojas. Atualizado em tempo real!</p>
        <GameOffersPanel exibirTodas={true} />
      </div>
      <FloatingScrollButtons />
    </div>
  )
}
