#!/usr/bin/env node

/**
 * Script de verificação do ambiente
 * Verifica se tudo está configurado corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do projeto Taverna do Café...\n');

const checks = [];

// Verificar Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
checks.push({
  name: 'Node.js versão',
  status: majorVersion >= 18 ? '✅' : '❌',
  message: majorVersion >= 18 
    ? `Node.js ${nodeVersion} (OK)` 
    : `Node.js ${nodeVersion} (requer 18+)`
});

// Verificar se .env existe
const envExists = fs.existsSync('.env');
checks.push({
  name: 'Arquivo .env',
  status: envExists ? '✅' : '❌',
  message: envExists ? 'Encontrado' : 'NÃO encontrado - copie .env.example'
});

// Verificar variáveis de ambiente
if (envExists) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  
  const hasClientId = envContent.includes('DISCORD_CLIENT_ID=') && 
                       !envContent.includes('DISCORD_CLIENT_ID=your_discord_client_id_here');
  checks.push({
    name: 'DISCORD_CLIENT_ID',
    status: hasClientId ? '✅' : '⚠️',
    message: hasClientId ? 'Configurado' : 'Falta configurar'
  });
  
  const hasClientSecret = envContent.includes('DISCORD_CLIENT_SECRET=') && 
                          !envContent.includes('DISCORD_CLIENT_SECRET=your_discord_client_secret_here');
  checks.push({
    name: 'DISCORD_CLIENT_SECRET',
    status: hasClientSecret ? '✅' : '⚠️',
    message: hasClientSecret ? 'Configurado' : 'Falta configurar'
  });
  
  const hasJwtSecret = envContent.includes('JWT_SECRET=') && 
                       !envContent.includes('JWT_SECRET=your_super_secret_jwt_key_here');
  checks.push({
    name: 'JWT_SECRET',
    status: hasJwtSecret ? '✅' : '⚠️',
    message: hasJwtSecret ? 'Configurado' : 'Falta configurar'
  });
}

// Verificar node_modules
const nodeModulesExists = fs.existsSync('node_modules');
checks.push({
  name: 'Dependências instaladas',
  status: nodeModulesExists ? '✅' : '❌',
  message: nodeModulesExists ? 'OK' : 'Execute: npm install'
});

// Verificar package.json
const packageExists = fs.existsSync('package.json');
checks.push({
  name: 'package.json',
  status: packageExists ? '✅' : '❌',
  message: packageExists ? 'OK' : 'Arquivo não encontrado'
});

// Imprimir resultados
console.log('📋 Resultados:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}: ${check.message}`);
});

// Resumo
const allOk = checks.every(c => c.status === '✅');
const hasWarnings = checks.some(c => c.status === '⚠️');

console.log('\n' + '='.repeat(50));
if (allOk) {
  console.log('✅ Tudo pronto! Execute: npm run dev');
} else if (hasWarnings) {
  console.log('⚠️  Configure o arquivo .env antes de continuar');
  console.log('📖 Veja: SETUP.md');
} else {
  console.log('❌ Há problemas que precisam ser resolvidos');
  console.log('📖 Veja: SETUP.md');
}
console.log('='.repeat(50) + '\n');

process.exit(allOk ? 0 : 1);
