# 🚀 Guia Rápido de Setup - Taverna do Café

## ⚡ Instalação Rápida (5 minutos)

### 1. Instalar dependências
```bash
cd taverna-cafe
npm install
```

### 2. Configurar Discord OAuth
1. Acesse: https://discord.com/developers/applications
2. Clique em "New Application"
3. Nome: "Taverna do Café"
4. Vá em **OAuth2** → **General**
5. Copie o **Client ID**
6. Clique em "Reset Secret" e copie o **Client Secret**
7. Em **Redirects**, adicione: `http://localhost:3000/api/auth/callback`

### 3. Configurar .env
```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar .env e adicionar:
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=cole_aqui_uma_string_aleatoria_de_32_caracteres
```

**Gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Rodar o projeto
```bash
npm run dev
```

Abra: http://localhost:3000

---

## ✅ Checklist

- [ ] Node.js 18+ instalado
- [ ] `npm install` executado com sucesso
- [ ] Discord Application criada
- [ ] Client ID e Secret copiados
- [ ] Redirect URI configurada no Discord
- [ ] Arquivo `.env` criado e preenchido
- [ ] JWT_SECRET gerado
- [ ] `npm run dev` rodando
- [ ] Site acessível em http://localhost:3000
- [ ] Login com Discord funcionando

---

## 🐛 Problemas Comuns

### Erro: "Invalid OAuth2 redirect_uri"
✅ Verifique se a URL no Discord Developer Portal é **exatamente**:
```
http://localhost:3000/api/auth/callback
```

### Erro: "Module not found"
✅ Delete `node_modules` e `.next`, depois reinstale:
```bash
rm -rf node_modules .next
npm install
```

### Login não funciona
✅ Verifique se o `.env` está na raiz do projeto e as variáveis estão corretas

### Página branca após login
✅ Verifique se o `JWT_SECRET` tem pelo menos 32 caracteres

---

## 📦 Build para Produção

```bash
npm run build
npm run start
```

---

## 🎯 Próximos Passos

1. ✅ **Personalize o design**: Ajuste cores em `tailwind.config.js`
2. ✅ **Adicione funcionalidades**: Crie novas páginas em `/app`
3. ✅ **Deploy**: Siga o README principal para deploy na SquareCloud

---

## 💡 Dicas

- Use `npm run dev` durante desenvolvimento (hot reload)
- Commit o `.env.example`, NUNCA o `.env`
- Para produção, atualize as URLs no `.env` e no Discord Developer Portal

---

**Dúvidas?** Confira o [README.md](README.md) completo!
