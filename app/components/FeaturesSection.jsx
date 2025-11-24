'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Users, Sparkles, Globe, Heart } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Seguro & Privado',
    description: 'Seus dados protegidos com criptografia de ponta a ponta.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Super Rápido',
    description: 'Experiência fluida e sem lag, mesmo com milhares de usuários.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Milhares de membros conectados todos os dias.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'Design Moderno',
    description: 'Interface futurista e intuitiva inspirada nas melhores plataformas.',
    color: 'from-discord-purple to-discord-blue',
  },
  {
    icon: Globe,
    title: 'Global',
    description: 'Conecte-se com pessoas do mundo todo em tempo real.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Heart,
    title: 'Feito com Amor',
    description: 'Desenvolvido pensando na melhor experiência para você.',
    color: 'from-red-500 to-rose-500',
  },
]

export default function FeaturesSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Por que escolher a{' '}
            <span className="neon-text">Taverna?</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Uma experiência única que combina o melhor das comunidades online
            com tecnologia de ponta.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="card glow-on-hover group cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold group-hover:neon-text transition-all">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="card max-w-3xl mx-auto p-12 glow-on-hover">
            <h3 className="text-4xl font-bold mb-4">
              Pronto para começar?
            </h3>
            <p className="text-xl text-gray-400 mb-8">
              Entre agora e faça parte da comunidade mais incrível da internet.
            </p>
            <motion.a
              href="/api/auth/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 btn-primary text-lg px-10 py-5"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Junte-se Agora
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
