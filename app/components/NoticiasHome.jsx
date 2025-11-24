"use client"
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const categorias = [
  { key: 'Games', label: 'Games' },
  { key: 'Geek', label: 'Cultura Geek' },
  { key: 'Filmes', label: 'Filmes & Séries' },
  { key: 'Anime', label: 'Anime' },
]

export default function NoticiasHome() {
  const [noticias, setNoticias] = useState([])
  const [categoria, setCategoria] = useState('')
  const [destaqueOnly, setDestaqueOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  // Estado para expandir texto
  const [expandId, setExpandId] = useState(null);

  useEffect(() => {
    setLoading(true)
    fetch(`/api/noticias?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setNoticias(data.noticias)
        setTotalPages(data.totalPages)
        setLoading(false)
      })
  }, [page])

  // Normaliza campos para garantir compatibilidade (API ou mock)
  const noticiasNormalizadas = noticias.map(n => {
    // Normaliza campos
    let imagem = n.imagem || n.image || '';
    let texto = n.texto || n.content || '';
    // Só busca imagem no conteúdo se o campo imagem estiver vazio
    if (!imagem) {
      try {
        const parsed = typeof texto === 'string' ? JSON.parse(texto) : texto;
        if (Array.isArray(parsed)) {
          const imgBlock = parsed.find(b => b.type === 'image' || b.tipo === 'imagem');
          if (imgBlock) imagem = imgBlock.value || imgBlock.valor || '';
          // Pega o primeiro bloco de texto, ou concatena todos os blocos de texto
          const textBlocks = parsed.filter(b => (b.type === 'text' || b.tipo === 'texto') && (b.value || b.valor));
          if (textBlocks.length > 0) {
            texto = textBlocks.map(b => b.value || b.valor).join(' ');
          } else {
            texto = '';
          }
        }
      } catch {}
    }
    if (!imagem) imagem = '/default-news.png';
    return {
      id: n.id,
      titulo: n.titulo || n.title || '',
      texto,
      imagem, // <-- garantir que o campo imagem seja passado corretamente
      categoria: n.categoria || n.category || '',
      destaque: n.destaque ?? n.destaque === true ? true : n.destaque === false ? false : n.destaque || n.destaque === 1,
      fonte: n.fonte || n.source || '',
      url: n.url || '',
      data: n.data || n.createdAt || '',
    }
  })
  let noticiasFiltradas = noticiasNormalizadas;
  if (categoria) noticiasFiltradas = noticiasFiltradas.filter(n => normalizarCategoria(n.categoria) === normalizarCategoria(categoria));
  if (destaqueOnly) noticiasFiltradas = noticiasFiltradas.filter(n => n.destaque)

  // DEBUG: Exibir categorias reais das notícias
  if (typeof window !== 'undefined') {
    console.log('Categorias encontradas nas notícias:', noticiasNormalizadas.map(n => n.categoria));
  }

  // Separar destaques das demais
  const destaques = noticiasFiltradas.filter(n => n.destaque)
  const comuns = noticiasFiltradas.filter(n => !n.destaque)

  // Skeleton loader
  const skeletons = Array.from({ length: 4 });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="w-full flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-extrabold neon-text flex items-center gap-2 mb-0 whitespace-nowrap">
          Notícias & Anúncios
        </h1>
      </div>
      <div className="flex flex-col md:flex-row md:gap-8 gap-0 md:items-start items-stretch">
        {/* Lado esquerdo: Filtros */}
        <div className="flex flex-col w-full md:w-[320px] flex-shrink-0 mb-0 md:mb-0 justify-start h-full">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border-2 border-discord-purple/40 shadow-xl flex flex-col gap-4 sticky md:top-36 animate-in">
          <h2 className="text-xl font-extrabold text-transparent bg-gradient-to-r from-discord-blue via-discord-purple to-discord-neon bg-clip-text mb-2">
            Filtrar
          </h2>
          <button
            onClick={() => setCategoria('')}
            className={`transition-all duration-200 w-full py-2 px-4 rounded-lg font-bold flex items-center justify-center shadow-md border-2 ${!categoria ? 'bg-discord-blue/40 text-white border-discord-neon scale-105' : 'bg-gray-900/60 text-discord-neon border-discord-purple/30 hover:bg-discord-blue/10'}`}
            style={{boxShadow: !categoria ? '0 0 16px #00d4ff55' : undefined}}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoria(cat.key)}
              className={`transition-all duration-200 w-full py-2 px-4 rounded-lg font-bold flex items-center justify-center shadow-md border-2 ${categoria === cat.key ? 'bg-discord-blue/40 text-white border-discord-neon scale-105' : 'bg-gray-900/60 text-discord-neon border-discord-purple/30 hover:bg-discord-blue/10'}`}
              style={{boxShadow: categoria === cat.key ? '0 0 16px #00d4ff55' : undefined}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      {/* Conteúdo de notícias */}
      <div className="flex-1 flex flex-col justify-start h-full grow">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6 py-10">
            {skeletons.map((_, i) => (
              <motion.div
                key={i}
                className="bg-discord-card rounded-xl p-6 border-2 border-discord-neon/20 shadow-lg flex flex-col gap-4 animate-pulse"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-full h-48 bg-zinc-800 rounded-lg mb-4" />
                <div className="h-6 w-1/2 bg-zinc-700 rounded mb-2" />
                <div className="h-4 w-3/4 bg-zinc-700 rounded mb-2" />
                <div className="h-4 w-2/3 bg-zinc-800 rounded" />
              </motion.div>
            ))}
          </div>
        ) : noticiasFiltradas.length === 0 ? (
          <div className="text-center text-gray-400 py-20">Nenhuma notícia encontrada.</div>
        ) : (
          <>
            {destaques.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-discord-neon mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-discord-neon rounded-full animate-pulse"></span>
                  Destaques
                </h2>
                <Swiper
                  spaceBetween={24}
                  slidesPerView={1}
                  breakpoints={{ 768: { slidesPerView: 2 } }}
                  className="w-full"
                >
                  {destaques.map((noticia, i) => (
                    <SwiperSlide key={noticia.id}>
                      <motion.div
                        className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border-2 border-discord-neon shadow-lg flex flex-col gap-4 hover:scale-[1.03] hover:shadow-2xl transition-transform duration-300 cursor-pointer"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-full h-48 flex items-center justify-center bg-zinc-900 rounded-lg overflow-hidden">
                          <img src={noticia.imagem} alt={noticia.titulo} className="max-h-full max-w-full object-contain" onError={e => { e.target.onerror=null; e.target.src='/default-news.png'; }} />
                        </div>
                        <div className="flex gap-2 items-center mb-1">
                          <span className="text-xs bg-discord-neon/20 text-discord-neon font-bold px-3 py-1 rounded-full animate-pulse">{noticia.categoria}</span>
                          <span className="text-xs text-gray-400">{noticia.data?.toString().slice(0,10)}</span>
                          <span className="text-xs text-gray-400 ml-auto">Fonte: <a href={noticia.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-discord-neon">{noticia.fonte}</a></span>
                        </div>
                        <h3 className="font-extrabold text-xl text-discord-neon">{noticia.titulo}</h3>
                        <p className="text-gray-300 text-base line-clamp-3 mb-2">
                          {expandId === noticia.id
                            ? noticia.texto
                            : typeof noticia.texto === 'string' ? noticia.texto.slice(0, 120) + (noticia.texto.length > 120 ? '...' : '') : ''}
                        </p>
                        {typeof noticia.texto === 'string' && noticia.texto.length > 120 && (
                          <button className="btn-primary text-xs px-3 py-1 mt-1" onClick={() => setExpandId(expandId === noticia.id ? null : noticia.id)}>
                            {expandId === noticia.id ? 'Ver menos' : 'Ver mais'}
                          </button>
                        )}
                        <a href={`/noticias/${noticia.id}`} className="btn-primary w-fit mt-auto px-4 py-2 text-base">Ler notícia completa</a>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
            {comuns.length > 0 && (
              <div className="grid gap-6">
                {comuns.map((noticia, i) => (
                  <motion.div
                    key={noticia.id}
                    className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-discord-purple/20 shadow flex flex-col md:flex-row gap-6 hover:scale-[1.02] hover:shadow-xl transition-transform duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <div className="w-full md:w-56 h-40 flex items-center justify-center bg-zinc-900 rounded-lg overflow-hidden">
                      {noticia.imagem && noticia.imagem !== '/default-news.png' ? (
                        <img src={noticia.imagem} alt={noticia.titulo} className="max-h-full max-w-full object-contain" onError={e => { e.target.onerror=null; e.target.src='/default-news.png'; }} />
                      ) : (
                        <img src="/default-news.png" alt="Sem imagem" className="max-h-full max-w-full object-contain opacity-60" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex gap-2 items-center mb-1">
                        <span className="text-xs bg-discord-neon/20 text-discord-neon font-bold px-3 py-1 rounded-full animate-pulse">{noticia.categoria}</span>
                        <span className="text-xs text-gray-400">{noticia.data?.toString().slice(0,10)}</span>
                        <span className="text-xs text-gray-400 ml-auto">Fonte: <a href={noticia.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-discord-neon">{noticia.fonte}</a></span>
                      </div>
                      <h4 className="font-bold text-lg text-discord-neon">{noticia.titulo}</h4>
                      <p className="text-gray-300 text-base line-clamp-2 mb-2">
                        {expandId === noticia.id
                          ? noticia.texto
                          : typeof noticia.texto === 'string' ? noticia.texto.slice(0, 80) + (noticia.texto.length > 80 ? '...' : '') : ''}
                      </p>
                      {typeof noticia.texto === 'string' && noticia.texto.length > 80 && (
                        <button className="btn-primary text-xs px-3 py-1 mt-1" onClick={() => setExpandId(expandId === noticia.id ? null : noticia.id)}>
                          {expandId === noticia.id ? 'Ver menos' : 'Ver mais'}
                        </button>
                      )}
                      <a href={`/noticias/${noticia.id}`} className="btn-primary w-fit mt-auto px-4 py-2 text-base">Ler notícia completa</a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Paginação */}
        <div className="flex justify-center gap-2 mt-10">
          <button className="btn-primary px-4 py-2" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
          <span className="px-4 py-2 font-bold text-discord-neon">Página {page} de {totalPages}</span>
          <button className="btn-primary px-4 py-2" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Próxima</button>
        </div>
      </div>
      </div>
    </div>
  );
}

function normalizarCategoria(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[ -\u0300-\u036f]/g, '').replace(/\s+/g, '');
}
