"use client"
import { useEffect, useState } from 'react'

export default function NoticiaDetalhe({ params }) {
  const { id } = params
  const [noticia, setNoticia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/noticias/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.noticia) setNoticia(data.noticia)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 40, textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando notícia...</div>;
  if (!noticia) return <div style={{ padding: 40, textAlign: 'center', color: 'red', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Notícia não encontrada.</div>;

  // Verifica se a primeira imagem do conteúdo é igual à imagem de capa
  let conteudoArr = [];
  try {
    const raw = noticia.conteudo || noticia.texto || noticia.content;
    conteudoArr = Array.isArray(raw) ? raw : JSON.parse(raw);
  } catch { conteudoArr = []; }
  const primeiraImagem = conteudoArr.find(b => b.type === 'image' || b.type === 'imagem');
  const mostrarImagemCapa = noticia.imagem && noticia.imagem !== '' && (!primeiraImagem || primeiraImagem.value !== noticia.imagem);

  return (
    <>
      <div style={{
        maxWidth: 800,
        margin: '120px auto 60px auto',
        padding: '36px 24px 44px 24px',
        background: 'rgba(34, 30, 51, 0.65)',
        borderRadius: 22,
        color: '#f3f3f3',
        boxShadow: '0 8px 40px 0 #000a',
        border: '1.5px solid rgba(162,89,247,0.18)',
        fontFamily: 'inherit',
        minHeight: 420,
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        transition: 'background 0.3s, box-shadow 0.3s',
      }}>
        <button onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/noticias')} style={{
          marginBottom: 24,
          background: 'linear-gradient(90deg, #a259f7 0%, #232526 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 22px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0005',
          transition: 'background 0.2s',
          outline: 'none',
          display: 'inline-block',
        }}>← Voltar</button>
        <h1 style={{
          fontSize: 38,
          fontWeight: 800,
          marginBottom: 18,
          letterSpacing: -1,
          textShadow: '0 2px 8px #000a',
          lineHeight: 1.15,
          color: '#ffe082',
          background: 'linear-gradient(90deg, #a259f7 0%, #ffe082 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>{noticia.titulo || noticia.title}</h1>
        {/* Imagem de capa removida conforme solicitado */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          opacity: 0.85,
          fontSize: 15,
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          {noticia.categoria && <span style={{ background: 'linear-gradient(90deg, #a259f7 0%, #232526 100%)', color: '#fff', padding: '3px 12px', borderRadius: 8 }}>{noticia.categoria}</span>}
          {noticia.data && <span style={{ color: '#ffe082' }}>{String(noticia.data).slice(0, 10)}</span>}
        </div>
        <div style={{ borderTop: '1px solid #a259f7', marginBottom: 24 }} />
        <ConteudoBlocos conteudo={noticia.conteudo || noticia.texto || noticia.content} principalTitulo={noticia.titulo || noticia.title} />
      </div>
      {/* Botão flutuante para subir/descer */}
      <div style={{
        position: 'fixed',
        right: 24,
        bottom: 32,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <button
          aria-label="Subir para o topo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: 'linear-gradient(90deg, #a259f7 0%, #232526 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            fontSize: 28,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 12px #0007',
            outline: 'none',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >↑</button>
        <button
          aria-label="Descer para o final"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          style={{
            background: 'linear-gradient(90deg, #232526 0%, #a259f7 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            fontSize: 28,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 12px #0007',
            outline: 'none',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >↓</button>
      </div>
    </>
  );
}

function ConteudoBlocos({ conteudo, principalTitulo }) {
  let blocos = [];
  if (Array.isArray(conteudo)) {
    blocos = conteudo;
  } else if (typeof conteudo === 'string') {
    try {
      const parsed = JSON.parse(conteudo);
      if (Array.isArray(parsed)) blocos = parsed;
    } catch {
      // fallback: mostrar como texto
      return <div style={{ fontSize: 18, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{conteudo}</div>;
    }
  }
  if (!blocos.length) return null;
  // Evitar títulos repetidos e imagens bugadas
  let lastTitle = null;
  return (
    <div style={{ fontSize: 19, lineHeight: 1.7 }}>
      {blocos.map((bloco, idx) => {
        if (!bloco || !bloco.type) return null;
        // Ocultar o primeiro bloco de título se for igual ao título principal
        if (bloco.type === 'title') {
          if ((idx === 0 && principalTitulo && bloco.value === principalTitulo) || bloco.value === lastTitle) return null;
          lastTitle = bloco.value;
          return <h2 key={idx} style={{ fontSize: 24, margin: '32px 0 16px', color: '#a259f7', fontWeight: 700, letterSpacing: -0.5 }}>{bloco.value}</h2>;
        }
        if (bloco.type === 'paragraph') {
          return <p key={idx} style={{ margin: '16px 0', color: '#f3f3f3', fontSize: 19, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{bloco.value}</p>;
        }
        if (bloco.type === 'list') {
          return Array.isArray(bloco.value) ? (
            <ul key={idx} style={{ margin: '16px 0 16px 32px', color: '#ffe082', fontSize: 18 }}>
              {bloco.value.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          ) : null;
        }
        // Bloco de imagem (compatível com 'imagem' e 'image')
        if (bloco.type === 'image' || bloco.type === 'imagem') {
          if (!bloco.value || typeof bloco.value !== 'string' || bloco.value.trim() === '') return null;
          return <img key={idx} src={bloco.value} alt='' style={{ maxWidth: '100%', borderRadius: 10, margin: '20px 0', boxShadow: '0 2px 12px #a259f799', background: '#232526' }} />;
        }
        // Default: bloco genérico
        return <div key={idx} style={{ margin: '12px 0', color: '#fff' }}>{bloco.value}</div>;
      })}
    </div>
  );
}
