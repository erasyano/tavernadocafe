# 🎨 Guia de Personalização - Taverna do Café

Este guia mostra como personalizar o design e funcionalidades do projeto.

---

## 🎨 Customizando Cores

### Alterar paleta de cores principal

Edite `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      discord: {
        dark: '#0c0c0f',        // ← Mude para sua cor escura
        darker: '#1a1a1f',      // ← Background mais escuro
        card: '#2b2d31',        // ← Cor dos cards
        hover: '#404249',       // ← Cor de hover
        purple: '#6a0dad',      // ← Sua cor primária (roxo)
        blue: '#5865F2',        // ← Sua cor secundária (azul)
        neon: '#00d4ff',        // ← Cor de destaque neon
      },
    },
  },
}
```

### Exemplo: Tema Verde/Amarelo

```js
colors: {
  discord: {
    dark: '#0a0f0a',
    darker: '#151f15',
    card: '#1f2d1f',
    hover: '#2d3f2d',
    purple: '#4ade80',     // Verde primário
    blue: '#fbbf24',       // Amarelo secundário
    neon: '#34d399',       // Verde neon
  },
}
```

---

## 🖼️ Customizando o Logo

### Opção 1: Substituir SVG

Substitua o conteúdo de `public/logo.svg` com seu próprio SVG.

### Opção 2: Usar imagem PNG/JPG

1. Adicione sua imagem em `public/` (ex: `logo.png`)
2. Edite `app/components/Navbar.jsx`:

```jsx
// Antes
<Coffee className="w-8 h-8 text-discord-purple relative z-10" />

// Depois
<Image src="/logo.png" alt="Logo" width={32} height={32} />
```

---

## ✏️ Customizando Textos

### Alterar nome da comunidade

Busque e substitua em todos os arquivos:

- **"Taverna do Café"** → Seu nome
- **"Taverna Club"** → Seu subtítulo

Arquivos principais:
- `app/components/Navbar.jsx`
- `app/components/HeroSection.jsx`
- `app/layout.js` (metadata)
- `README.md`

### Alterar slogan

Em `app/components/HeroSection.jsx`:

```jsx
<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
  A próxima geração de comunidades online.  // ← Altere aqui
  <br />
  Conecte-se, crie e compartilhe em um espaço futurista.  // ← E aqui
</p>
```

---

## 📊 Customizando Dashboard

### Alterar estatísticas

Em `app/components/DashboardContent.jsx`:

```jsx
const stats = [
  { 
    icon: MessageSquare, 
    label: 'Mensagens',      // ← Nome da stat
    value: '1.2K',           // ← Valor
    change: '+12%',          // ← Mudança
    color: 'from-blue-500 to-cyan-500'  // ← Cores do ícone
  },
  // Adicione mais stats...
]
```

### Adicionar nova seção

Adicione em `app/components/DashboardContent.jsx`:

```jsx
{/* Nova Seção - Notificações */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  className="card"
>
  <h2 className="text-2xl font-bold mb-6">🔔 Notificações</h2>
  <p>Você não tem novas notificações</p>
</motion.div>
```

---

## 🎭 Customizando Animações

### Velocidade das animações

Em `tailwind.config.js`:

```js
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',  // ← Mude 0.5s para mais rápido/lento
  'slide-down': 'slideDown 0.3s ease-out',
  'glow-pulse': 'glowPulse 2s ease-in-out infinite',
},
```

### Desabilitar animações

Remova ou comente as props `motion` dos componentes:

```jsx
// Antes (com animação)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Conteúdo
</motion.div>

// Depois (sem animação)
<div>
  Conteúdo
</div>
```

---

## 🧩 Adicionando Novas Páginas

### 1. Criar nova página

Crie `app/comunidade/page.js`:

```js
import Navbar from '../components/Navbar'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

async function getUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export default async function ComunidadePage() {
  const user = await getUser()

  return (
    <main className="min-h-screen">
      <Navbar user={user} />
      <div className="pt-32 px-6">
        <h1 className="text-5xl font-bold">Comunidade</h1>
        <p>Conteúdo da página aqui...</p>
      </div>
    </main>
  )
}
```

### 2. Adicionar no Navbar

Edite `app/components/Navbar.jsx`:

```jsx
<Link href="/comunidade" className="navbar-link">
  Comunidade
</Link>
```

---

## 🔒 Proteger Novas Páginas

### Opção 1: No próprio componente

```js
import { redirect } from 'next/navigation'

export default async function MinhaPageProtegida() {
  const user = await getUser()
  
  if (!user) {
    redirect('/')  // Redireciona se não logado
  }
  
  return <div>Conteúdo protegido</div>
}
```

### Opção 2: No middleware

Edite `middleware.js`:

```js
const protectedPaths = [
  '/dashboard', 
  '/perfil', 
  '/configuracoes',
  '/minha-nova-pagina'  // ← Adicione aqui
]
```

---

## 🎨 Customizando Cards

### Criar variante de card

Em `app/globals.css`:

```css
.card-primary {
  @apply card border-2 border-discord-purple;
}

.card-highlight {
  @apply card bg-gradient-to-br from-discord-purple/20 to-discord-blue/20;
}
```

Use:

```jsx
<div className="card-primary">
  Card com borda roxa
</div>

<div className="card-highlight">
  Card com fundo gradiente
</div>
```

---

## 🔔 Adicionar Notificações

Instale uma lib de toast:

```bash
npm install react-hot-toast
```

Use:

```jsx
import { toast } from 'react-hot-toast'

// Sucesso
toast.success('Login realizado com sucesso!')

// Erro
toast.error('Erro ao fazer login')

// Info
toast('Nova mensagem recebida')
```

---

## 📱 Customizar Responsividade

### Breakpoints do Tailwind

- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

### Exemplo: Esconder em mobile

```jsx
<div className="hidden md:block">
  Visível apenas em telas médias ou maiores
</div>

<div className="block md:hidden">
  Visível apenas em mobile
</div>
```

---

## 🌐 Internacionalização (i18n)

### Adicionar português/inglês

Crie `lib/translations.js`:

```js
export const t = {
  pt: {
    welcome: 'Bem-vindo à',
    login: 'Entrar com Discord',
  },
  en: {
    welcome: 'Welcome to',
    login: 'Login with Discord',
  }
}
```

Use:

```jsx
const lang = 'pt' // ou 'en'
<h1>{t[lang].welcome} Taverna do Café</h1>
```

---

## 💡 Dicas Rápidas

### Adicionar Google Fonts

1. Em `app/layout.js`:

```js
import { Inter, Poppins } from 'next/font/google'

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'] 
})

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
```

### Adicionar Meta Tags

Em `app/layout.js`:

```js
export const metadata = {
  title: 'Taverna do Café',
  description: 'Descrição aqui',
  keywords: 'comunidade, discord, taverna',
  openGraph: {
    title: 'Taverna do Café',
    description: 'Descrição para redes sociais',
    images: ['/og-image.png'],
  },
}
```

---

## 🎯 Próximos Passos Sugeridos

1. ✅ **Sistema de níveis**: XP, ranks, leaderboard
2. ✅ **Chat em tempo real**: Socket.io ou Firebase
3. ✅ **Perfil personalizável**: Banner, bio, badges
4. ✅ **Sistema de conquistas**: Gamificação completa
5. ✅ **Marketplace**: Loja de itens/benefícios
6. ✅ **Integração com bot Discord**: Comandos, eventos

---

**📖 Mais ajuda?** Confira o [README.md](README.md) principal!
