# 🌟 Taverna do Café

<div align="center">
  <img src="public/logo.svg" alt="Taverna do Café" width="200"/>
  
  ### A próxima geração de comunidades online
  
  ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![Discord OAuth](https://img.shields.io/badge/Discord-OAuth2-5865F2?style=for-the-badge&logo=discord)
</div>

---

## 📋 Sobre o Projeto

**Taverna do Café** (também conhecida como **Taverna Club**) é uma plataforma de comunidade moderna e futurista com design inspirado no Discord. Construída com Next.js 14 e Tailwind CSS, oferece uma experiência visual impressionante com autenticação via Discord OAuth2.

### ✨ Características

- 🎨 **Design Futurista**: Interface dark com tons neon roxo e azul
- 🔐 **Login Discord**: Autenticação OAuth2 totalmente integrada
- 🚀 **Performance**: Next.js 14 com App Router e Server Components
- 💫 **Animações**: Transições suaves com Framer Motion
- 📱 **Responsivo**: Design adaptável para todos os dispositivos
- 🛡️ **Seguro**: JWT para gerenciamento de sessões

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ instalado
- Conta Discord Developer
- npm ou yarn

### 1️⃣ Clonar o Repositório

```bash
git clone <seu-repositorio>
cd taverna-cafe
```

### 2️⃣ Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 3️⃣ Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 4️⃣ Configurar Discord OAuth

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova Application
3. Vá em **OAuth2** > **General**
4. Copie o **Client ID** e **Client Secret**
5. Adicione a Redirect URL: `http://localhost:3000/api/auth/callback`
6. Cole as credenciais no arquivo `.env`:

```env
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback

NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=crie_uma_chave_secreta_aqui_minimo_32_caracteres
```

> 💡 **Dica**: Para gerar uma JWT_SECRET segura, use:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 5️⃣ Rodar o Projeto

```bash
npm run dev
# ou
yarn dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do Projeto

```
taverna-cafe/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.js      # Inicia OAuth
│   │       ├── callback/route.js   # Callback Discord
│   │       ├── logout/route.js     # Logout
│   │       └── me/route.js         # Info do usuário
│   ├── components/
│   │   ├── Navbar.jsx              # Navbar principal
│   │   ├── UserMenu.jsx            # Menu dropdown do usuário
│   │   ├── HeroSection.jsx         # Seção hero da home
│   │   ├── FeaturesSection.jsx     # Seção de features
│   │   └── DashboardContent.jsx    # Conteúdo do dashboard
│   ├── dashboard/
│   │   └── page.js                 # Página do dashboard (protegida)
│   ├── globals.css                 # Estilos globais + Tailwind
│   ├── layout.js                   # Layout root
│   └── page.js                     # Homepage
├── lib/
│   ├── auth.js                     # Funções de autenticação JWT
│   └── discord.js                  # Integração Discord API
├── public/
│   ├── logo.svg                    # Logo da Taverna
│   └── favicon.svg                 # Favicon
├── .env.example                    # Exemplo de variáveis de ambiente
├── next.config.js                  # Configuração Next.js
├── tailwind.config.js              # Configuração Tailwind
└── package.json
```

---

## 🎨 Design System

### Paleta de Cores

```css
/* Cores principais */
--discord-dark: #0c0c0f
--discord-darker: #1a1a1f
--discord-card: #2b2d31
--discord-hover: #404249
--discord-purple: #6a0dad
--discord-blue: #5865F2
--discord-neon: #00d4ff
```

### Componentes Principais

#### Navbar
- Logo animado com efeito de rotação
- Links com underline animado
- Menu de usuário com dropdown
- Totalmente responsivo

#### Dashboard
- Estatísticas em tempo real
- Atividades recentes
- Sistema de conquistas
- Ações rápidas

---

## 🔐 Autenticação

### Fluxo OAuth2

1. Usuário clica em "Login com Discord"
2. Redireciona para Discord OAuth
3. Usuário autoriza a aplicação
4. Discord redireciona com `code`
5. Backend troca `code` por `access_token`
6. Busca dados do usuário
7. Cria JWT e armazena em cookie
8. Redireciona para dashboard

### Proteção de Rotas

Páginas protegidas verificam o cookie `auth_token`:

```js
import { getUserFromCookie } from '@/lib/auth'

const user = await getUserFromCookie(request)
if (!user) redirect('/')
```

---

## 🚀 Deploy na SquareCloud

### 1️⃣ Preparar para Produção

Atualize o `.env` com URLs de produção:

```env
DISCORD_REDIRECT_URI=https://seudominio.com/api/auth/callback
NEXT_PUBLIC_BASE_URL=https://seudominio.com
```

### 2️⃣ Build do Projeto

```bash
npm run build
```

### 3️⃣ Configurar SquareCloud

Crie o arquivo `squarecloud.config`:

```toml
[app]
name = "taverna-cafe"
main = "server.js"
memory = 512
version = "recommended"

[env]
DISCORD_CLIENT_ID = "seu_client_id"
DISCORD_CLIENT_SECRET = "seu_client_secret"
DISCORD_REDIRECT_URI = "https://seudominio.com/api/auth/callback"
NEXT_PUBLIC_BASE_URL = "https://seudominio.com"
JWT_SECRET = "sua_jwt_secret"
```

### 4️⃣ Deploy

```bash
npm run build
# Upload para SquareCloud via CLI ou Dashboard
```

### 5️⃣ Atualizar Discord Developer Portal

- Adicione a URL de produção nas Redirect URLs
- Ative as intents necessárias

---

## 📦 Tecnologias Utilizadas

- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária
- **[Framer Motion](https://www.framer.com/motion/)** - Animações fluidas
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[Jose](https://github.com/panva/jose)** - JWT (incluído no Next.js)
- **[Discord OAuth2](https://discord.com/developers/docs/topics/oauth2)** - Autenticação

---

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento local (porta 3000)
npm run build    # Build para produção
npm run start    # Inicia servidor de produção
npm run lint     # Verifica código com ESLint
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📧 Contato

**Taverna do Café** - [@TavernaClub](https://discord.gg/seu-servidor)

Link do Projeto: [https://github.com/seu-usuario/taverna-cafe](https://github.com/seu-usuario/taverna-cafe)

---

<div align="center">
  <p>Feito com 💜 por <strong>Taverna Club</strong></p>
  <p>
    <a href="#-taverna-do-café">Voltar ao topo ⬆️</a>
  </p>
</div>
"# tavernadocafe"  
