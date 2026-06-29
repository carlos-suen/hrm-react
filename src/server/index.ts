import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createLocalSupabaseAdmin } from './lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import employeesRouter from './routes/employees'
import approvalsRouter from './routes/approvals'
import dashboardRouter from './routes/dashboard'
import attendanceRouter from './routes/attendance'
import payrollRouter from './routes/payroll'
import recruitmentRouter from './routes/recruitment'
import trainingRouter from './routes/training'
import performanceRouter from './routes/performance'
import authRouter from './routes/auth'
import type { AuthPayload } from './lib/auth'

type Variables = {
  supabaseAdmin: SupabaseClient
  user: AuthPayload
}

const app = new Hono<{ Variables: Variables }>()

app.use('*', cors())
app.use('*', logger())

// 注入 Supabase 客戶端到 context（本地開發用 process.env）
app.use('/api/*', async (c, next) => {
  c.set('supabaseAdmin', createLocalSupabaseAdmin())
  await next()
})

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.route('/api/auth', authRouter)
app.route('/api/employees', employeesRouter)
app.route('/api/approvals', approvalsRouter)
app.route('/api/dashboard', dashboardRouter)
app.route('/api/attendance', attendanceRouter)
app.route('/api/payroll', payrollRouter)
app.route('/api/recruitment', recruitmentRouter)
app.route('/api/training', trainingRouter)
app.route('/api/performance', performanceRouter)

export default app
