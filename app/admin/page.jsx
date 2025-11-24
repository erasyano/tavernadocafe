
"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
const NewsAdmin = dynamic(() => import("./news.jsx"), { ssr: false })
const CarouselAdmin = dynamic(() => import("./carousel.jsx"), { ssr: false })
const CategoriesAdmin = dynamic(() => import("./CategoriesAdmin.jsx"), { ssr: false })
import AdminUserPanel from "../components/AdminUserPanel.jsx"
import SorteiosPanel from "../components/SorteiosPanel.jsx"

export default function AdminDashboard() {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [tab, setTab] = useState("users")
	const router = useRouter()

	useEffect(() => {
		fetch("/api/auth/me").then(res => res.json()).then(data => {
			if (!data.authenticated || !data.user.isAdmin) {
				router.replace("/login")
			} else {
				setUser(data.user)
				setLoading(false)
			}
		})
	}, [router])

	if (loading) return <div className="text-center py-20 text-zinc-400">Carregando painel admin...</div>

	return (
		<div className="min-h-screen bg-gradient-to-br from-zinc-950 to-discord-blue/40 flex flex-col">
			<header className="w-full bg-zinc-900/80 border-b border-discord-purple/30 py-6 px-8 flex items-center justify-between shadow-lg">
				<div className="flex items-center gap-4">
					<span className="text-2xl font-extrabold neon-text">Painel Admin</span>
					<span className="text-zinc-400 text-sm ml-4">Bem-vindo, <b>{user?.globalName || user?.email}</b></span>
				</div>
			</header>
				<nav className="flex gap-4 justify-center mt-8 mb-4 z-20 relative bg-zinc-900/90 rounded-2xl shadow-xl py-6 px-8">
					<button className={`btn-secondary ${tab==="users"?"bg-discord-neon/20 text-discord-neon font-bold":""}`} onClick={()=>setTab("users")}>Gerenciar Usuários</button>
					<button className={`btn-secondary ${tab==="sorteios"?"bg-discord-neon/20 text-discord-neon font-bold":""}`} onClick={()=>setTab("sorteios")}>Gerenciar Sorteios</button>
				<button className={`btn-secondary ${tab==="posts"?"bg-discord-neon/20 text-discord-neon font-bold":""}`} onClick={()=>setTab("posts")}>Gerenciar Postagens</button>
				<button className={`btn-secondary ${tab==="carousel"?"bg-discord-neon/20 text-discord-neon font-bold":""}`} onClick={()=>setTab("carousel")}>Gerenciar Carrossel</button>
				<button className={`btn-secondary ${tab==="categorias"?"bg-discord-neon/20 text-discord-neon font-bold":""}`} onClick={()=>setTab("categorias")}>Gerenciar Categorias Class</button>
				</nav>
				<main className="flex-1 flex flex-col items-center justify-start py-10 px-4 z-20 relative bg-zinc-900/90 rounded-2xl shadow-xl w-full max-w-7xl mx-auto">
					{tab === "users" && <AdminUserPanel currentUser={user} />}
					{tab === "sorteios" && <SorteiosPanel />}
					{tab === "posts" && <NewsAdmin />}
					{tab === "carousel" && <CarouselAdmin />}
					{tab === "categorias" && <CategoriesAdmin />}
				</main>
		</div>
	)
}



function AdminPosts() {
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		fetch("/api/noticias?page=1").then(res => res.json()).then(data => {
			setPosts(Array.isArray(data?.noticias)?data.noticias:[])
			setLoading(false)
		})
	},[])
	if (loading) return <div className="text-zinc-400">Carregando postagens...</div>
	return (
		<div className="w-full max-w-3xl bg-zinc-900/80 rounded-2xl shadow-xl p-8 mt-6">
			<h2 className="text-xl font-bold mb-4 neon-text">Postagens</h2>
			<ul className="divide-y divide-zinc-800">
				{posts.map(p => (
					<li key={p.id} className="py-4 flex flex-col gap-1">
						<span className="font-bold text-discord-neon text-lg">{p.titulo}</span>
						<span className="text-zinc-300 text-sm">{p.categoria} | {new Date(p.data).toLocaleDateString()}</span>
						{p.imagem && (
							<img src={p.imagem} alt="imagem" className="w-20 h-12 object-cover rounded-lg border border-zinc-800 my-1" />
						)}
						<a
							className="btn-primary px-2 py-1 text-xs w-fit mt-1"
							href={`/noticias/${p.id}`}
							target="_blank"
							rel="noopener noreferrer"
						>Ver</a>
					</li>
				))}
			</ul>
		</div>
	)
}

