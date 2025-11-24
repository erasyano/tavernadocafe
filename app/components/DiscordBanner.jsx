import { Gamepad2, ExternalLink } from 'lucide-react'

export default function DiscordBanner() {
  return (
    <div className="w-full flex flex-col items-center justify-center my-8">
      <div className="relative w-full max-w-2xl mx-auto bg-gradient-to-r from-discord-purple via-discord-neon to-discord-blue p-1 rounded-3xl shadow-2xl animate-pulse">
        <div className="bg-discord-dark rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4">
            <Gamepad2 className="w-12 h-12 text-discord-neon drop-shadow-glow" />
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white neon-text mb-1">Entre no nosso Discord!</h2>
              <p className="text-gray-200 text-sm md:text-base">Junte-se à comunidade, participe dos papos, eventos e fique por dentro das melhores ofertas de jogos.</p>
            </div>
          </div>
          <a
            href="https://discord.gg/ZhBEQh7KGv"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 btn-primary text-lg px-8 py-3 flex items-center gap-2 font-bold shadow-lg neon-border hover:scale-105 transition-transform"
          >
            Entrar no Discord
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
