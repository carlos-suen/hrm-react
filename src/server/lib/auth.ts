import { verify, type JwtTokenPayload } from 'hono/jwt'
import type { Context, Next } from 'hono'

// JWT 載荷：包含用戶基礎信息
export interface AuthPayload extends JwtTokenPayload {
  userId: number
  username: string
  role: string
}

// 從環境變數讀取 JWT 密鑰（禁止硬編碼）
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    // 開發環境回退值，生產必須通過環境變數配置
    // TODO: [Technical Debt] 生產環境必須移除此回退值
    return 'dev-only-secret-do-not-use-in-production'
  }
  return secret
}

// 認證中間件：驗證 Bearer Token 並注入用戶信息到 context
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '未提供認證令牌' }, 401)
  }

  const token = authHeader.slice(7)

  try {
    const payload = (await verify(token, getJwtSecret())) as AuthPayload

    // 注入用戶信息到 context
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ error: '令牌無效或已過期' }, 401)
  }
}

// 從 context 獲取當前登錄用戶
export const getCurrentUser = (c: Context): AuthPayload => {
  return c.get('user') as AuthPayload
}

export { getJwtSecret }
