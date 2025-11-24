import { PrismaClient } from '@prisma/client'

// Evita múltiplas instâncias no Next.js em dev
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
