# 📝 Comandos Úteis - Taverna do Café

## 🚀 Desenvolvimento

```bash
# Verificar se tudo está configurado corretamente
npm run check

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar localmente
# http://localhost:3000

# Limpar cache e reinstalar
rm -rf .next node_modules
npm install

# Verificar erros de lint
npm run lint
```

---

## 🏗️ Build e Produção

```bash
# Build para produção
npm run build

# Testar build localmente
npm run build
npm run start

# Analisar tamanho do bundle (adicional)
npm install --save-dev @next/bundle-analyzer
```

---

## 🔐 Discord OAuth - Comandos Úteis

```bash
# Gerar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Gerar Client Secret alternativo (64 chars)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Ver variáveis de ambiente (PowerShell)
Get-Content .env

# Copiar .env.example para .env
copy .env.example .env
```

---

## 🐛 Debug e Troubleshooting

```bash
# Ver logs detalhados do Next.js
npm run dev -- --turbo

# Limpar cache do Next.js
rm -rf .next

# Ver versão do Node.js
node --version

# Ver versão do npm
npm --version

# Verificar portas em uso (PowerShell)
netstat -ano | findstr :3000

# Matar processo na porta 3000 (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

---

## 📦 Gerenciamento de Dependências

```bash
# Instalar nova dependência
npm install pacote-novo

# Instalar dependência de desenvolvimento
npm install --save-dev pacote-dev

# Remover dependência
npm uninstall pacote-nome

# Atualizar todas as dependências
npm update

# Ver dependências desatualizadas
npm outdated

# Instalar versão específica
npm install next@14.2.0
```

---

## 🎨 Tailwind CSS

```bash
# Regenerar tipos do Tailwind (se usar TypeScript)
npx tailwindcss init -p

# Ver todas as classes disponíveis
npx tailwindcss-cli@latest --help

# Build CSS manualmente (não necessário com Next.js)
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch
```

---

## 🔄 Git (Controle de Versão)

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "🎉 Initial commit - Taverna do Café"

# Adicionar remote (GitHub)
git remote add origin https://github.com/seu-usuario/taverna-cafe.git

# Push para GitHub
git push -u origin main

# Ver status
git status

# Ver histórico
git log --oneline
```

---

## 🌐 Deploy SquareCloud

```bash
# Build para produção
npm run build

# Criar arquivo .zip para upload
# PowerShell:
Compress-Archive -Path * -DestinationPath taverna-cafe.zip

# Listar arquivos no build
Get-ChildItem .next -Recurse

# Ver tamanho do build
du -sh .next
```

---

## 🧪 Testing (Opcional)

```bash
# Instalar Jest + React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Rodar testes
npm test

# Cobertura de testes
npm run test:coverage
```

---

## 🔍 Análise e Performance

```bash
# Analisar bundle size
npm install --save-dev @next/bundle-analyzer
npm run analyze

# Verificar performance com Lighthouse
# (usar Chrome DevTools)

# Verificar acessibilidade
npm install --save-dev @axe-core/playwright
npx playwright test
```

---

## 📊 Logs e Monitoramento

```bash
# Ver logs do servidor (desenvolvimento)
npm run dev

# Ver logs de build
npm run build 2>&1 | tee build.log

# Monitorar arquivos em tempo real (PowerShell)
Get-Content -Path "logs/app.log" -Wait -Tail 50
```

---

## 🛠️ Manutenção

```bash
# Limpar tudo e reinstalar
rm -rf node_modules .next package-lock.json
npm install

# Atualizar Next.js para última versão
npm install next@latest react@latest react-dom@latest

# Verificar segurança das dependências
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

---

## 💻 Comandos VS Code

```bash
# Abrir projeto no VS Code
code .

# Instalar extensões recomendadas
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

---

## 🎯 Produtividade

```bash
# Criar novo componente rapidamente
echo 'export default function NomeComponente() { return <div>Conteúdo</div> }' > app/components/NomeComponente.jsx

# Buscar texto em todos os arquivos
grep -r "texto-buscar" .

# Contar linhas de código
find . -name '*.js' -o -name '*.jsx' | xargs wc -l

# Formatar código com Prettier (se instalado)
npx prettier --write .
```

---

## 🔐 Segurança

```bash
# Verificar variáveis de ambiente
node -e "console.log(process.env)"

# Gerar hash seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Verificar se .env está no .gitignore
cat .gitignore | grep .env
```

---

## 📱 Mobile Testing

```bash
# Rodar em rede local (acessível por celular)
npm run dev -- -H 0.0.0.0

# Ver IP da máquina (PowerShell)
ipconfig | Select-String "IPv4"

# Acessar do celular:
# http://SEU_IP:3000
```

---

## 🎨 Geração de Assets

```bash
# Criar favicon de diferentes tamanhos (requer ImageMagick)
convert logo.svg -resize 32x32 favicon-32.png
convert logo.svg -resize 16x16 favicon-16.png

# Otimizar SVGs (requer svgo)
npm install -g svgo
svgo public/logo.svg
```

---

## 📖 Documentação

```bash
# Gerar documentação automática (JSDoc)
npm install --save-dev jsdoc
npx jsdoc -c jsdoc.json

# Criar documentação de API
npm install --save-dev swagger-jsdoc swagger-ui-express
```

---

## 🚀 Atalhos Úteis

### PowerShell (Windows)

```powershell
# Alias para npm run dev
Set-Alias -Name dev -Value "npm run dev"

# Alias para limpar e reinstalar
function Clean-Install {
    Remove-Item -Recurse -Force node_modules, .next
    npm install
}
```

### Bash (Linux/Mac)

```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc
alias dev='npm run dev'
alias build='npm run build'
alias clean='rm -rf node_modules .next && npm install'
```

---

## 📚 Recursos Extras

```bash
# Documentação Next.js
open https://nextjs.org/docs

# Documentação Tailwind
open https://tailwindcss.com/docs

# Discord Developer Portal
open https://discord.com/developers/applications

# Framer Motion Docs
open https://www.framer.com/motion
```

---

**💡 Dica**: Adicione seus comandos mais usados como scripts no `package.json`!
