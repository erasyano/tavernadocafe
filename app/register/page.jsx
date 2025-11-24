"use client"
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 to-discord-purple/30">
      <AuthForm mode="register" onSuccess={() => router.push("/login")} />
      <div className="text-center mt-4 text-zinc-300">
        Já tem conta? <a href="/login" className="text-discord-neon underline">Entrar</a>
      </div>
    </div>
  )
}
