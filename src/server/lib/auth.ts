import { verify, type JwtTokenPayload } from 'hono/jwt'
import type { Context, Next } from 'hono'

// JWT 載荷：包含用戶基礎信息
export interface AuthPayload extends JwtTokenPayload {
  userId: number
  username: string
  role: string
}

// 從 context 讀取 JWT 密鑰（禁止硬編碼）
// 生產 Workers: c.env.JWT_SECRET 經 worker.ts 中間件注入到 c.get('jwtSecret')
// 本地 Node: process.env.JWT_SECRET 經 index.ts 中間件注入到 c.get('jwtSecret')
const getJwtSecret = (c: Context): string => {
  const fromCtx = c.get('jwtSecret') as string | undefined
  if (fromCtx) return fromCtx
  // 兜底：直接從環境讀（兼容未走中間件的場景）
  // 用 typeof 守衛避免 Workers 下 process 未定義拋 ReferenceError
  const fromEnv = typeof process !== 'undefined' ? process.env?.JWT_SECRET : undefined
  if (fromEnv) return fromEnv
  // 開發環境回退值，生產必須通過環境變數配置
  // TODO: [Technical Debt] 生產環境必須移除此回退值
  return 'dev-only-secret-do-not-use-in-production'
}

// 認證中間件：驗證 Bearer Token 並注入用戶信息到 context
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '未提供認證令牌' }, 401)
  }

  const token = authHeader.slice(7)

  try {
    const payload = (await verify(token, getJwtSecret(c))) as AuthPayload

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
