"use client";
import { useState } from "react";

// Exemplo de dados de usuários (substitua pelo fetch real se necessário)
const usersData = [
  { id: 1, displayName: "MESTRE", username: "mestre", email: "albertomartinscaju@gmail.com" },
  { id: 2, displayName: "João", username: "joaogamer", email: "joao@email.com" },
  { id: 3, displayName: "Ana", username: "ana123", email: "ana@email.com" },
];

export default function Page() {
  const [search, setSearch] = useState("");

  // Filtro: nome, email ou @username
  const filteredUsers = usersData.filter((user) => {
    const searchLower = search.toLowerCase().replace(/^@/, "");
    return (
      user.displayName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8 max-w-2xl mx-auto z-10 relative bg-zinc-900/80 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-discord-neon">Gerenciar Usuários</h2>
      <input
        type="text"
        placeholder="Buscar por nome, email ou @usuario"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-lg border-2 border-discord-neon/40 bg-zinc-900 text-white mb-6 focus:outline-none focus:border-discord-neon"
      />
      <div className="space-y-4">
        {filteredUsers.length === 0 && (
          <div className="text-zinc-400">Nenhum usuário encontrado.</div>
        )}
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-1 border border-discord-neon/20">
            <span className="font-bold text-discord-neon">{user.displayName}</span>
            <span className="text-cyan-400">@{user.username}</span>
            <span className="text-zinc-400 text-sm">{user.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

