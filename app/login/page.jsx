"use client"
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/navigation'


export default function LoginPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 to-discord-blue/30 relative overflow-hidden">
      {/* Fundo removido: página de login padrão */}
      {/* Painel de login na frente */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <AuthForm mode="login" onSuccess={() => router.push("/dashboard")} />
        <div className="text-center mt-4 text-zinc-300">
          Não tem conta? <a href="/register" className="text-discord-neon underline">Registre-se</a>
        </div>
      </div>
    </div>
  )
}
