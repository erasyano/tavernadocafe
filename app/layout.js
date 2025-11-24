import './globals.css'
import { Inter } from 'next/font/google'

import Navbar from './components/Navbar'
import NeonStarsBackground from './components/NeonStarsBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Taverna do Café - A próxima geração de comunidades online',
  description: 'Entre na Taverna Club e faça parte de uma comunidade futurista e moderna',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NeonStarsBackground />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
