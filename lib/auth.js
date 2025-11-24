

import jwt from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export function createToken(user) {
  // Reduzido para evitar exceder o limite do cookie
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: !!user.isAdmin
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function hashPassword(password) {
  return await hash(password, 10)
}

export async function verifyPassword(password, hashValue) {
  return await compare(password, hashValue)
}

export function getUserFromCookie(cookieStore) {
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}
