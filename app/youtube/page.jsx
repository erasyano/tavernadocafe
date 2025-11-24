
import Link from 'next/link'

export default function YoutubePage({ noOuter = false }) {
  const Content = (
    <>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 neon-text flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-discord-neon"><path d="M10.5 8.5L16 12L10.5 15.5V8.5Z" fill="currentColor"/></svg>
        Taverna do Café no YouTube
      </h1>
      <p className="text-gray-300 mb-6 text-lg">Acompanhe nosso canal para vídeos sobre <b>jogos</b>, <b>cultura geek</b>, <b>reviews</b>, <b>lives</b> e muito mais! Faça parte da nossa comunidade também por lá.</p>
      <div className="mb-8 flex flex-col gap-4">
        <div className="w-full aspect-video rounded-xl border border-discord-purple/30 shadow-lg overflow-hidden bg-black">
          <iframe
            src="https://www.youtube.com/embed/t7Y7QBfzcQc"
            title="Vídeo em destaque - Taverna do Café"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            style={{ display: 'block' }}
          ></iframe>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-discord-card rounded-xl p-4 border border-discord-purple/20 shadow">
            <h2 className="text-xl font-bold mb-2 text-discord-neon">O que você encontra no canal?</h2>
            <ul className="list-disc pl-6 text-gray-200 space-y-1">
              <li>Gameplay de lançamentos e clássicos</li>
              <li>Reviews e primeiras impressões</li>
              <li>Dicas, tutoriais e curiosidades</li>
              <li>Lives e interação com a comunidade</li>
              <li>Conteúdo geek, cultura pop e novidades</li>
            </ul>
          </div>
          <div className="flex-1 bg-discord-card rounded-xl p-4 border border-discord-purple/20 shadow flex flex-col gap-2 justify-center">
            <h2 className="text-xl font-bold mb-2 text-discord-neon">Junte-se à Taverna!</h2>
            <p className="text-gray-300">Inscreva-se no canal e ative o sininho para não perder nenhum vídeo novo. Participe também do nosso servidor Discord para interagir com outros membros.</p>
            <Link href="https://www.youtube.com/@tavernadocafe" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 mt-2">
              Visite nosso canal no YouTube
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-discord-card rounded-xl p-4 border border-discord-purple/20 shadow">
        <h2 className="text-lg font-bold text-discord-neon mb-2">Últimos vídeos e playlists</h2>
        <p className="text-gray-300 mb-2">Confira mais vídeos diretamente no canal e explore nossas playlists temáticas!</p>
        <Link href="https://www.youtube.com/@tavernadocafe/playlists" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
          Playlists do Canal
        </Link>
      </div>
    </>
  );
  if (noOuter) return Content;
  return (
    <div className="pt-24 min-h-screen bg-discord-dark">
      <div className="w-full max-w-3xl mx-auto px-4 py-8 z-10 relative bg-zinc-900/80 rounded-2xl shadow-2xl">
        {Content}
      </div>
    </div>
  );
}
