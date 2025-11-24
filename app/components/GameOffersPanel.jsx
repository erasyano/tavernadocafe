
"use client"
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, ShoppingCart, ExternalLink } from 'lucide-react'




export default function GameOffersPanel({ user, exibirTodas }) {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos') // 'todos', 'gratis', 'promocoes'

  // Busca ofertas da API interna agregada
  async function fetchOffers() {
    setLoading(true)
    try {
      const res = await fetch('/api/ofertas')
      const data = await res.json()
      if (data && data.offers) {
        setOffers(data.offers)
      } else {
        setOffers([])
      }
    } catch (e) {
      setOffers([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOffers()
    const interval = setInterval(fetchOffers, 30000)
    return () => clearInterval(interval)
  }, [])


  // Filtro de ofertas
  let ofertasFiltradas = offers
  if (filtro === 'gratis') {
    ofertasFiltradas = offers.filter(o => o.price && o.price.toLowerCase().includes('grátis'))
  } else if (filtro === 'promocoes') {
    ofertasFiltradas = offers.filter(o => o.discount && o.discount > 0 && (!o.price || !o.price.toLowerCase().includes('grátis')))
  }
  const ofertasParaExibir = exibirTodas ? ofertasFiltradas : ofertasFiltradas.slice(0, 3)

  return (
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Gamepad2 className="w-7 h-7 text-discord-neon" />
        Ofertas de Jogos em Tempo Real
      </h2>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded font-bold border ${filtro === 'todos' ? 'bg-discord-neon text-black' : 'bg-discord-card text-white border-discord-neon'}`}
          onClick={() => setFiltro('todos')}
        >Todos</button>
        <button
          className={`px-4 py-2 rounded font-bold border ${filtro === 'gratis' ? 'bg-discord-neon text-black' : 'bg-discord-card text-white border-discord-neon'}`}
          onClick={() => setFiltro('gratis')}
        >Grátis</button>
        <button
          className={`px-4 py-2 rounded font-bold border ${filtro === 'promocoes' ? 'bg-discord-neon text-black' : 'bg-discord-card text-white border-discord-neon'}`}
          onClick={() => setFiltro('promocoes')}
        >Promoções</button>
      </div>
      <div className="mb-4 text-sm text-gray-400">
        <b>Dica:</b> Se algum link de oferta não abrir corretamente, teste o site da loja manualmente (Steam, Epic Games, GOG). Algumas promoções podem ser regionais ou temporárias.
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader neon-border"></div>
        </div>
      ) : ofertasParaExibir.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-center text-gray-400 gap-4">
          <span className="text-3xl">😕</span>
          <span className="text-lg font-semibold">Nenhuma oferta encontrada no momento.</span>
          <span className="text-sm">Pode ser um problema temporário na API ou não há promoções disponíveis agora.<br/>Tente novamente mais tarde.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertasParaExibir.map(offer => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-discord-card rounded-2xl p-4 flex flex-col gap-3 border border-discord-purple/30 shadow-lg neon-border hover:scale-[1.02] transition-transform"
            >
              <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2">
                <img src={offer.image} alt={offer.title} className="object-cover w-full h-full" />
                <span className="absolute top-2 left-2 bg-discord-purple text-white text-xs px-3 py-1 rounded-full font-bold shadow">
                  {offer.platform}
                </span>
                <span className="absolute top-2 right-2 bg-discord-neon text-black text-xs px-3 py-1 rounded-full font-bold shadow">
                  -{offer.discount}%
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{offer.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-discord-neon text-xl font-bold">{offer.price}</span>
                  <span className="text-gray-400 line-through">{offer.oldPrice}</span>
                </div>
              </div>
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 justify-center mt-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Ver Oferta
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
