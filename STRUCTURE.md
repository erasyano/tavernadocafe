# 🗂️ Estrutura do Projeto - Taverna do Café

```
taverna-cafe/
│
├── 📁 app/                          # Next.js 14 App Router
│   │
│   ├── 📁 api/                      # API Routes (Backend)
│   │   └── 📁 auth/                 # Autenticação Discord
│   │       ├── 📁 login/
│   │       │   └── route.js         # ➡️ Inicia OAuth Discord
│   │       ├── 📁 callback/
│   │       │   └── route.js         # ➡️ Callback OAuth (recebe code)
│   │       ├── 📁 logout/
│   │       │   └── route.js         # ➡️ Logout do usuário
│   │       └── 📁 me/
│   │           └── route.js         # ➡️ Retorna dados do usuário logado
│   │
│   ├── 📁 components/               # Componentes React
│   │   ├── Navbar.jsx               # 🎨 Navbar com logo e menu
│   │   ├── UserMenu.jsx             # 🎨 Dropdown do perfil do usuário
│   │   ├── HeroSection.jsx          # 🎨 Seção hero da homepage
│   │   ├── FeaturesSection.jsx      # 🎨 Seção de features/benefícios
│   │   └── DashboardContent.jsx     # 🎨 Conteúdo do dashboard
│   │
│   ├── 📁 dashboard/                # Área protegida do dashboard
│   │   └── page.js                  # 🔒 Página principal do dashboard
│   │
│   ├── globals.css                  # 🎨 Estilos globais + Tailwind
│   ├── layout.js                    # 📐 Layout raiz (HTML, Head, Body)
│   └── page.js                      # 🏠 Homepage (/)
│
├── 📁 lib/                          # Bibliotecas e utilitários
│   ├── auth.js                      # 🔐 Funções JWT (criar, verificar tokens)
│   └── discord.js                   # 🤖 Integração com Discord API
│
├── 📁 public/                       # Arquivos estáticos
│   ├── logo.svg                     # ☕ Logo da Taverna (animado)
│   └── favicon.svg                  # 🎯 Favicon do site
│
├── 📄 .env.example                  # 📝 Exemplo de variáveis de ambiente
├── 📄 .env                          # 🔒 Variáveis de ambiente (NÃO commitar)
├── 📄 .env.development              # 💻 Guia para ambiente de dev
├── 📄 .gitignore                    # 🚫 Arquivos ignorados pelo Git
├── 📄 .eslintrc.json                # ✅ Configuração do ESLint
├── 📄 jsconfig.json                 # ⚙️ Configuração JavaScript (paths)
├── 📄 middleware.js                 # 🛡️ Middleware de proteção de rotas
├── 📄 next.config.js                # ⚙️ Configuração do Next.js
├── 📄 postcss.config.js             # ⚙️ Configuração PostCSS
├── 📄 tailwind.config.js            # 🎨 Configuração Tailwind CSS
├── 📄 package.json                  # 📦 Dependências e scripts
├── 📄 check-setup.js                # 🔍 Script de verificação do setup
├── 📄 README.md                     # 📖 Documentação completa
└── 📄 SETUP.md                      # 🚀 Guia rápido de instalação

```

---

## 🎯 Fluxo de Arquivos Importantes

### 🔐 Autenticação (OAuth2 + JWT)

```
1. Usuário clica "Login"
   ↓
2. app/api/auth/login/route.js
   → Redireciona para Discord OAuth
   ↓
3. Usuário autoriza no Discord
   ↓
4. app/api/auth/callback/route.js
   → Recebe code
   → lib/discord.js → Troca code por access_token
   → lib/discord.js → Busca dados do usuário
   → lib/auth.js → Cria JWT
   → Define cookie auth_token
   → Redireciona para /dashboard
   ↓
5. app/dashboard/page.js
   → Verifica cookie
   → lib/auth.js → Valida JWT
   → Renderiza dashboard ou redireciona
```

### 🎨 Componentes e Páginas

```
Homepage (/)
├── app/page.js (Server Component)
│   ├── Lê cookie auth_token
│   ├── Valida JWT
│   └── Renderiza:
│       ├── <Navbar user={user} />
│       ├── <HeroSection user={user} />
│       └── <FeaturesSection />

Dashboard (/dashboard)
├── app/dashboard/page.js (Server Component)
│   ├── Verifica autenticação
│   ├── Redireciona se não autenticado
│   └── Renderiza:
│       ├── <Navbar user={user} />
│       └── <DashboardContent user={user} />
```

### 🛡️ Proteção de Rotas

```
middleware.js
├── Intercepta todas as requisições
├── Verifica se rota é protegida (/dashboard, /perfil, etc)
├── Checa cookie auth_token
└── Redireciona se não autenticado
```

---

## 📦 Dependências Principais

| Pacote | Versão | Uso |
|--------|--------|-----|
| `next` | 14.2.0 | Framework React com SSR |
| `react` | 18.3.0 | Biblioteca UI |
| `tailwindcss` | 3.4.1 | Estilização utilitária |
| `framer-motion` | 11.0.0 | Animações fluidas |
| `lucide-react` | 0.344.0 | Ícones modernos |

---

## 🎨 Sistema de Design

### Cores (tailwind.config.js)
- `discord-dark` - Background principal (#0c0c0f)
- `discord-purple` - Cor primária (#6a0dad)
- `discord-blue` - Cor secundária (#5865F2)
- `discord-neon` - Destaques (#00d4ff)

### Componentes Reutilizáveis (globals.css)
- `.btn-primary` - Botão principal com gradiente
- `.btn-secondary` - Botão secundário
- `.card` - Card com efeito glass
- `.glass-effect` - Efeito vidro fosco
- `.neon-text` - Texto com gradiente neon

---

## 🔧 Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build para produção
npm run start      # Inicia servidor de produção
npm run lint       # Verifica código com ESLint
npm run check      # Verifica configuração do projeto
```

---

## 📝 Variáveis de Ambiente Necessárias

```env
DISCORD_CLIENT_ID          # ID da aplicação Discord
DISCORD_CLIENT_SECRET      # Secret da aplicação Discord
DISCORD_REDIRECT_URI       # URL de callback OAuth
NEXT_PUBLIC_BASE_URL       # URL base da aplicação
JWT_SECRET                 # Chave secreta para JWT (min 32 chars)
```

---

## 🚀 Deploy - Checklist

- [ ] Build funciona (`npm run build`)
- [ ] `.env` de produção configurado
- [ ] Discord Developer Portal atualizado com URL de produção
- [ ] Variáveis de ambiente configuradas no host
- [ ] Domínio configurado (se aplicável)

---

**💡 Dica**: Use `npm run check` para verificar se tudo está configurado!
