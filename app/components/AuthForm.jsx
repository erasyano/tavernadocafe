"use client"
import { useState } from "react"

export default function AuthForm({ mode = "discord", onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleDiscordLogin() {
    window.location.href = "/api/auth/login?provider=discord";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        mode === "register" ? "/api/auth/register" : "/api/auth/loginlocal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            ...(mode === "register" ? { name } : {}),
          }),
          credentials: "include"
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao autenticar");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (mode === "login" || mode === "register") {
    return (
      <form onSubmit={handleSubmit} className="bg-zinc-900/90 p-10 rounded-2xl shadow-2xl max-w-md mx-auto flex flex-col gap-6 mt-16 border border-zinc-800 text-center">
        <h2 className="text-3xl font-extrabold mb-2 neon-text drop-shadow">{mode === "register" ? "Registrar" : "Entrar"}</h2>
        {mode === "register" && (
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="input"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="btn-primary w-full py-3 text-lg font-bold shadow-md"
          disabled={loading}
        >
          {loading ? "Enviando..." : mode === "register" ? "Registrar" : "Entrar"}
        </button>
      </form>
    );
  }
  // Default: só Discord
  return (
    <div className="bg-zinc-900/90 p-10 rounded-2xl shadow-2xl max-w-md mx-auto flex flex-col gap-6 mt-16 border border-zinc-800 text-center">
      <h2 className="text-3xl font-extrabold mb-2 neon-text drop-shadow">Entrar com Discord</h2>
      <p className="text-zinc-400 mb-6 text-sm">O acesso à plataforma é feito via Discord ou conta local.</p>
      <button onClick={handleDiscordLogin} className="btn-primary w-full py-3 text-lg font-bold shadow-md">
        Entrar com Discord
      </button>
    </div>
  );
}
