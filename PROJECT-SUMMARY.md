# ☕ Taverna do Café - Projeto Completo

<div align="center">
  <h3>✨ Sistema completo de comunidade futurista com Next.js + Discord OAuth2 ✨</h3>
  
  **Status**: 🟢 Pronto para uso
  
  [🚀 Quick Start](#-quick-start-5-minutos) • [📚 Documentação](#-documentação) • [🎨 Features](#-features-implementadas)
</div>

---

## 🎯 O Que Foi Criado

Um sistema **completo e funcional** de comunidade online com:

✅ **Autenticação Discord OAuth2** (login, logout, sessões)  
✅ **Dashboard interativo** com estatísticas e atividades  
✅ **Design futurista** (estilo Discord com neon roxo/azul)  
✅ **Animações suaves** (Framer Motion)  
✅ **Proteção de rotas** (middleware JWT)  
✅ **Totalmente responsivo** (mobile-first)  
✅ **Pronto para deploy** (SquareCloud)  

---

## 🚀 Quick Start (5 minutos)

```bash
# 1. Entrar na pasta
cd taverna-cafe

# 2. Instalar dependências
npm install

# 3. Copiar .env
copy .env.example .env

# 4. Configurar Discord OAuth
# → https://discord.com/developers/applications
# → Criar Application
# → Copiar Client ID e Secret
# → Adicionar redirect: http://localhost:3000/api/auth/callback

# 5. Editar .env com suas credenciais

# 6. Rodar projeto
npm run dev

# 7. Acessar
# → http://localhost:3000
```

**Detalhes completos**: Veja [SETUP.md](SETUP.md)

---

## 🎨 Features Implementadas

### 🔐 Autenticação
- ✅ Login via Discord OAuth2
- ✅ JWT com cookies HttpOnly
- ✅ Proteção automática de rotas
- ✅ Logout funcional
- ✅ Sessões persistentes (7 dias)

### 🎨 Design & UI
- ✅ Dark theme futurista
- ✅ Gradientes neon (roxo/azul)
- ✅ Animações com Framer Motion
- ✅ Micro-interações em botões
- ✅ Efeitos glass morphism
- ✅ Navbar com menu dropdown
- ✅ Cards com hover effects

### 📱 Páginas
- ✅ **Homepage** - Hero section + Features
- ✅ **Dashboard** - Stats, atividades, conquistas
- ✅ **Área protegida** - Só acessível logado

### 🧩 Componentes
- ✅ Navbar responsiva com logo animado
- ✅ UserMenu com dropdown animado
- ✅ HeroSection com CTA
- ✅ FeaturesSection com cards
- ✅ DashboardContent completo

### 🛠️ Técnico
- ✅ Next.js 14 (App Router)
- ✅ Server Components
- ✅ API Routes
- ✅ Middleware de proteção
- ✅ Tailwind CSS customizado
- ✅ TypeScript ready (jsconfig)

---

## 📁 Estrutura do Projeto

```
taverna-cafe/
├── app/
│   ├── api/auth/          # OAuth2 + JWT
│   ├── components/        # React components
│   ├── dashboard/         # Dashboard protegido
│   ├── globals.css        # Estilos + Tailwind
│   └── page.js           # Homepage
├── lib/
│   ├── auth.js           # JWT utilities
│   └── discord.js        # Discord API
├── public/
│   ├── logo.svg          # Logo animado
│   └── favicon.svg       # Favicon
├── .env.example          # Template de variáveis
├── middleware.js         # Proteção de rotas
├── README.md            # Documentação completa
├── SETUP.md             # Guia rápido
├── STRUCTURE.md         # Estrutura detalhada
├── CUSTOMIZATION.md     # Guia de customização
└── COMMANDS.md          # Comandos úteis
```

**Visualização completa**: [STRUCTURE.md](STRUCTURE.md)

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| [README.md](README.md) | 📖 Documentação completa do projeto |
| [SETUP.md](SETUP.md) | 🚀 Guia rápido de instalação (5 min) |
| [STRUCTURE.md](STRUCTURE.md) | 🗂️ Estrutura de arquivos detalhada |
| [CUSTOMIZATION.md](CUSTOMIZATION.md) | 🎨 Como personalizar cores, textos, etc |
| [COMMANDS.md](COMMANDS.md) | 📝 Comandos úteis para dev e deploy |

---

## 🎨 Preview de Design

### 🌈 Paleta de Cores
```css
Background:  #0c0c0f → #1a1a1f  (gradiente dark)
Primária:    #6a0dad              (roxo neon)
Secundária:  #5865F2              (azul Discord)
Destaque:    #00d4ff              (ciano neon)
Cards:       #2b2d31              (cinza escuro)
```

### ✨ Elementos Visuais
- 🎭 Efeitos de blur e glow
- 🌊 Gradientes animados no background
- ⚡ Micro-animações em hover
- 🪟 Glass morphism nos cards
- 💫 Transições suaves (0.3s)

---

## 🔧 Tecnologias Usadas

| Tech | Versão | Uso |
|------|--------|-----|
| Next.js | 14.2.0 | Framework React SSR |
| React | 18.3.0 | Biblioteca UI |
| Tailwind CSS | 3.4.1 | Estilização |
| Framer Motion | 11.0.0 | Animações |
| Lucide React | 0.344.0 | Ícones |
| Discord OAuth2 | - | Autenticação |
| JWT (custom) | - | Sessões |

---

## 🛡️ Segurança

- ✅ JWT com expiração (7 dias)
- ✅ Cookies HttpOnly (protege contra XSS)
- ✅ Tokens assinados com HMAC SHA-256
- ✅ Variáveis sensíveis em `.env`
- ✅ `.env` no `.gitignore`
- ✅ Middleware de proteção de rotas

---

## 🚀 Deploy

### SquareCloud (Recomendado)

1. Configure `.env` de produção
2. Build: `npm run build`
3. Upload via SquareCloud CLI ou Dashboard
4. Configure variáveis de ambiente no painel
5. Atualize Discord Developer Portal com URL de produção

**Guia detalhado**: [README.md - Deploy na SquareCloud](README.md#-deploy-na-squarecloud)

### Outras Plataformas

- ✅ Vercel (Next.js nativo)
- ✅ Netlify
- ✅ Railway
- ✅ Render

---

## 📝 Checklist Pré-Deploy

- [ ] `npm run build` funciona sem erros
- [ ] `.env` de produção configurado
- [ ] Discord Developer Portal atualizado com URL de produção
- [ ] JWT_SECRET gerado (32+ caracteres)
- [ ] Variáveis de ambiente no host
- [ ] Testado em mobile
- [ ] Meta tags configuradas
- [ ] Favicon adicionado

---

## 🎯 Próximos Passos Sugeridos

### Fase 1 - Melhorias Básicas
- [ ] Adicionar página de Perfil
- [ ] Página de Configurações
- [ ] Sistema de notificações
- [ ] Busca de usuários

### Fase 2 - Gamificação
- [ ] Sistema de XP e níveis
- [ ] Conquistas (achievements)
- [ ] Leaderboard
- [ ] Badges personalizados

### Fase 3 - Comunidade
- [ ] Chat em tempo real (Socket.io)
- [ ] Sistema de posts/feed
- [ ] Comentários e reações
- [ ] Grupos/canais privados

### Fase 4 - Integração Discord
- [ ] Bot Discord integrado
- [ ] Sincronização de roles
- [ ] Comandos slash
- [ ] Webhooks de eventos

---

## 🐛 Troubleshooting

### Problemas comuns:

**"Module not found"**
```bash
rm -rf node_modules .next
npm install
```

**Login não funciona**
- Verifique Client ID/Secret no Discord
- Confirme Redirect URI exata
- Veja logs do console

**Build falha**
- Rode `npm run build` localmente
- Verifique erros de lint
- Confirme todas as env vars

**Mais ajuda**: [COMMANDS.md](COMMANDS.md)

---

## 📞 Suporte

- 📖 Documentação completa: [README.md](README.md)
- 🚀 Setup rápido: [SETUP.md](SETUP.md)
- 🎨 Customização: [CUSTOMIZATION.md](CUSTOMIZATION.md)
- 📝 Comandos: [COMMANDS.md](COMMANDS.md)
- 🗂️ Estrutura: [STRUCTURE.md](STRUCTURE.md)

---

## 📊 Status do Projeto

| Componente | Status |
|------------|--------|
| Autenticação | ✅ Completo |
| Dashboard | ✅ Completo |
| UI/Design | ✅ Completo |
| Responsivo | ✅ Completo |
| Documentação | ✅ Completo |
| Testes | ⚠️ Não implementado |
| CI/CD | ⚠️ Não implementado |

---

## 📄 Licença

MIT License - Livre para uso pessoal e comercial

---

## 🎉 Resultado Final

Você tem em mãos um projeto **completo, funcional e profissional**:

✅ **Frontend** - Design moderno e animado  
✅ **Backend** - API Routes com OAuth2  
✅ **Auth** - Sistema completo de autenticação  
✅ **Dashboard** - Área protegida funcional  
✅ **Docs** - Documentação detalhada  
✅ **Deploy** - Pronto para produção  

**Tempo estimado de setup**: 5-10 minutos  
**Linhas de código**: ~2000+  
**Arquivos criados**: 30+  

---

<div align="center">
  <h3>🌟 Pronto para começar? 🌟</h3>
  <p>
    <code>cd taverna-cafe && npm install && npm run dev</code>
  </p>
  <p>
    <strong>Feito com 💜 para a Taverna do Café / Taverna Club</strong>
  </p>
</div>
