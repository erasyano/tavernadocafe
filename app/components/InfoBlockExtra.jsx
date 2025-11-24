export default function InfoBlockExtra() {
  return (
    <div className="w-full mt-10 rounded-2xl p-8 shadow-xl border border-[#232b3e] flex flex-col items-center" style={{backgroundColor:'#181c2b', opacity:1, background:'#181c2b'}}>
      <h4 className="text-xl font-bold text-neon-blue mb-2">Fique por dentro!</h4>
      <p className="text-base text-gray-200 mb-2 text-center max-w-2xl">
        Novas aulas e playlists são adicionadas toda semana. Participe da comunidade, envie sugestões de temas e compartilhe suas conquistas!
      </p>
      <ul className="list-disc ml-5 text-sm text-neon-blue/80 mb-2">
        <li>Novidades e eventos exclusivos</li>
        <li>Ranking dos alunos</li>
        <li>Suporte e dúvidas direto com a equipe</li>
      </ul>
    </div>
  );
}
