'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Crown,
  TrendingUp,
  Award,
  Star,
  Zap
} from 'lucide-react'

export default function DashboardContent({ user }) {
  const stats = [
    { icon: MessageSquare, label: 'Mensagens', value: '1.2K', change: '+12%', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Amigos', value: '42', change: '+5', color: 'from-purple-500 to-pink-500' },
    { icon: Activity, label: 'Atividade', value: '89%', change: '+8%', color: 'from-green-500 to-emerald-500' },
    { icon: Crown, label: 'Rank', value: '#127', change: '+23', color: 'from-yellow-500 to-orange-500' },
  ]

  const recentActivity = [
    { type: 'achievement', text: 'Conquistou o badge "Early Adopter"', time: '2h atrás' },
    { type: 'friend', text: 'Novo amigo: @CafeLover', time: '5h atrás' },
    { type: 'level', text: 'Subiu para o nível 12', time: '1d atrás' },
    { type: 'message', text: 'Participou de 10 conversas hoje', time: '2d atrás' },
  ]

  return (
    <div className="pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-discord-purple to-discord-blue rounded-full blur-xl opacity-50"></div>
              <Image
                src={user.avatar || '/default-avatar.png'}
                alt={user.globalName}
                width={100}
                height={100}
                className="rounded-full ring-4 ring-discord-purple relative z-10"
              />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Bem-vindo de volta, <span className="neon-text">{user.globalName}</span>!
              </h1>
              <p className="text-xl text-gray-400">
                Pronto para mais uma jornada incrível na Taverna?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            // Gradients and color classes for each block
            const gradients = [
              'from-blue-500/60 via-cyan-400/50 to-blue-700/60',
              'from-purple-500/60 via-pink-400/50 to-purple-700/60',
              'from-green-500/60 via-emerald-400/50 to-green-700/60',
              'from-yellow-400/60 via-orange-400/50 to-yellow-600/60',
            ];
            const borderColors = [
              'border-blue-400',
              'border-purple-400',
              'border-green-400',
              'border-yellow-300',
            ];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card group overflow-hidden border rounded-2xl bg-gradient-to-br ${gradients[index]} backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl relative ${borderColors[index]}`}
                style={{ minHeight: 200, borderWidth: '2px' }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 backdrop-blur-[2.5px] transition-all duration-300 z-0" />
                <div className="relative z-10 flex flex-col h-full justify-between p-7 gap-2">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="p-4 rounded-2xl flex items-center justify-center bg-white/10 shadow-md">
                      <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-full shadow bg-white/20 text-white/90 backdrop-blur">
                      <TrendingUp className="w-4 h-4 opacity-80" />
                      {stat.change}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.p
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="text-5xl font-black text-white mb-1 tracking-tight drop-shadow-lg"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-lg font-semibold text-white/90 mb-2 uppercase tracking-wide drop-shadow">
                      {stat.label}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    className="rounded-xl border-0 bg-white/20 text-white px-6 py-2 text-sm font-bold mt-2 shadow hover:bg-white/30 hover:text-black transition-all duration-200 backdrop-blur"
                  >
                    Saber mais
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 card rounded-3xl bg-gray-800/60 shadow-xl border-0 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl flex flex-col items-start justify-start pt-5 pb-8 px-8 gap-2 text-left"
          >
            <h2 className="text-3xl font-extrabold text-discord-purple-light flex items-center gap-3 mb-2 tracking-tight drop-shadow-lg">
              <Activity className="w-8 h-8 text-discord-purple-light" /> Atividade Recente
            </h2>
            <div className="flex flex-col gap-3 w-full max-w-2xl">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex flex-row items-center gap-5 p-6 rounded-2xl bg-discord-hover/40 hover:bg-discord-hover/60 transition-colors shadow-lg min-h-[72px]"
                >
                  <div className={`w-4 h-4 rounded-full ${
                    activity.type === 'achievement' ? 'bg-yellow-400' :
                    activity.type === 'friend' ? 'bg-purple-300' :
                    activity.type === 'level' ? 'bg-purple-400' :
                    'bg-green-400'
                  }`}></div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold text-lg leading-tight">{activity.text}</p>
                    <p className="text-sm text-gray-200 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Achievements */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card rounded-3xl bg-gray-800/60 shadow-xl border-0 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl flex flex-col items-center justify-center p-8 gap-4 text-center"
            >
              <h2 className="text-2xl font-extrabold text-discord-blue flex items-center justify-center gap-2 mb-4 tracking-tight">
                <Zap className="w-7 h-7 text-discord-blue" /> Ações Rápidas
              </h2>
              <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="w-full text-center p-4 rounded-xl bg-discord-blue/10 hover:bg-discord-blue/20 text-discord-blue font-semibold shadow border-0 transition-all"
                >
                  {/* Explorar Comunidades removido */}
                  <div className="text-xs text-gray-400 mt-1">Descubra novos grupos</div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="w-full text-center p-4 rounded-xl bg-discord-purple/10 hover:bg-discord-purple/20 text-discord-purple font-semibold shadow border-0 transition-all"
                >
                  Convidar Amigos
                  <div className="text-xs text-gray-400 mt-1">Ganhe recompensas</div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="w-full text-center p-4 rounded-xl bg-discord-neon/10 hover:bg-discord-neon/20 text-discord-neon font-semibold shadow border-0 transition-all"
                >
                  Ver Perfil
                  <div className="text-xs text-gray-400 mt-1">Personalize seu perfil</div>
                </motion.button>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card rounded-3xl bg-gray-800/60 shadow-xl border-0 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl flex flex-col items-center justify-center p-8 gap-4 text-center"
            >
              <h2 className="text-2xl font-extrabold text-yellow-400 flex items-center justify-center gap-2 mb-4 tracking-tight">
                <Award className="w-7 h-7 text-yellow-400" /> Conquistas
              </h2>
              <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                {[ 
                  { name: 'Early Adopter', rarity: 'Épico' },
                  { name: 'Socialite', rarity: 'Raro' },
                  { name: 'Night Owl', rarity: 'Comum' },
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-yellow-400/10 shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center mb-1">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-base text-yellow-400 mb-0">{achievement.name}</p>
                    <p className="text-xs text-gray-400">{achievement.rarity}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
