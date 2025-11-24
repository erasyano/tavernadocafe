export default function VideoIntroBlock({ youtubeId }) {
  const id = youtubeId || "9bZkp7q19f0";
  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
      <div className="w-full md:w-[520px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-[#00f2fe] bg-black flex items-center justify-center">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${id}`}
          title="Apresentação Taverna Class"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="flex-1 rounded-2xl p-6 shadow-xl border border-[#232b3e] min-w-[260px] max-w-md" style={{backgroundColor:'#181c2b', opacity:1, background:'#181c2b'}}>
        <h2 className="text-2xl font-bold text-neon-blue mb-2">Bem-vindo à Taverna Class!</h2>
        <p className="text-base text-gray-200 mb-2">Aqui você encontra videoaulas exclusivas sobre jogos, dicas, estratégias e muito mais. Aprenda, evolua e compartilhe conhecimento com a comunidade gamer!</p>
        <ul className="list-disc ml-5 text-sm text-neon-blue/80 mb-2">
          <li>Playlists temáticas</li>
          <li>Conteúdo para iniciantes e avançados</li>
          <li>Comunidade ativa</li>
        </ul>
        <div className="mt-4">
          <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-bold shadow-lg hover:scale-105 transition">Comece agora</button>
        </div>
      </div>
    </div>
  );
}
