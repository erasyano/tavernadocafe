import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import Navbar from '../components/Navbar'
import DashboardContent from '../components/DashboardContent'

async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  // Detecta host para fetch server-side
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/perfil`, {
    cache: 'no-store',
    credentials: 'include',
    headers: {
      cookie: `auth_token=${token}`
    }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

export default async function DashboardPage() {
  const user = await getUser();
  // Redirecionar para home se não estiver autenticado
  if (!user) {
    redirect('/');
  }
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-discord-purple/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-discord-blue/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <DashboardContent user={user} />
    </main>
  );
}
