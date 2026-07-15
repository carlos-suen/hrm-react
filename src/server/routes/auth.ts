import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import bcrypt from 'bcryptjs'
import type { Context } from 'hono'
import { getSupabaseAdmin } from '../lib/supabase'
import { authMiddleware, getCurrentUser, getJwtSecret, type AuthPayload } from '../lib/auth'

const router = new Hono()

// Token 有效期：24 小時
const TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24

// 公開返回的用戶信息（剔除敏感欄位）
const sanitizeUser = (u: Record<string, unknown>) => ({
  id: u.id,
  username: u.username,
  nickname: u.nickname,
  role: u.role,
  created_at: u.created_at,
  updated_at: u.updated_at,
})

// 簽發 JWT（需要 context 來取密鑰）
const issueToken = (payload: Omit<AuthPayload, 'iat' | 'exp'>, c: Context): Promise<string> => {
  return sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_IN_SECONDS },
    getJwtSecret(c)
  )
}

// 註冊：username + password + nickname
router.post('/register', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const body = await c.req.json()
    // 用戶名統一轉小寫，實現忽略大小寫
    const username = body.username?.toLowerCase().trim()
    const password = body.password
    const nickname = body.nickname

    // 輸入校驗
    if (!username || !password) {
        return c.json({ error: '用戶名和密碼為必填項' }, 400)
    }
  if (password.length < 6) {
    return c.json({ error: '密碼長度至少 6 位' }, 400)
  }

  // 檢查用戶名是否已存在
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (existing) {
    return c.json({ error: '用戶名已被註冊' }, 409)
  }

  // 密碼哈希：bcrypt 自帶 salt，單獨 salt 欄位冗餘但仍寫入以符合表結構
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      username,
      password: hashedPassword,
      salt,
      nickname: nickname || username,
      role: 'user',
    })
    .select()
    .single()

  if (error) {
    return c.json({ error: error.message }, 400)
  }

  return c.json({ user: sanitizeUser(data) }, 201)
})

// 登錄：username + password
router.post('/login', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const body = await c.req.json()
    // 用戶名統一轉小寫，與註冊保持一致，實現忽略大小寫登錄
    const username = body.username?.toLowerCase().trim()
    const password = body.password

    if (!username || !password) {
        return c.json({ error: '用戶名和密碼為必填項' }, 400)
    }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  // 統一錯誤信息，避免泄露用戶是否存在
  if (error || !data) {
    return c.json({ error: '用戶名或密碼錯誤' }, 401)
  }

  if (!bcrypt.compareSync(password, data.password)) {
    return c.json({ error: '用戶名或密碼錯誤' }, 401)
  }

  const token = await issueToken({
    userId: data.id,
    username: data.username,
    role: data.role,
  }, c)

  return c.json({ token, user: sanitizeUser(data) })
})

// 獲取當前登錄用戶
router.get('/me', authMiddleware, async (c) => {
  const supabaseAdmin = getSupabaseAdmin(c)
  const currentUser = getCurrentUser(c)

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, nickname, role, created_at, updated_at')
    .eq('id', currentUser.userId)
    .single()

  if (error || !data) {
    return c.json({ error: '用戶不存在' }, 404)
  }

  return c.json({ user: data })
})

export default router
