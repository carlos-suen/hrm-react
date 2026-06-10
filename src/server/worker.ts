import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import employeesRouter from './routes/employees'
import approvalsRouter from './routes/approvals'
import dashboardRouter from './routes/dashboard'
import attendanceRouter from './routes/attendance'
import payrollRouter from './routes/payroll'
import recruitmentRouter from './routes/recruitment'
import trainingRouter from './routes/training'
import performanceRouter from './routes/performance'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

type Variables = {
  supabaseAdmin: SupabaseClient
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('*', cors())
app.use('*', logger())

// 注入 Supabase 客戶端到 context
app.use('/api/*', async (c, next) => {
  const supabaseAdmin = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  c.set('supabaseAdmin', supabaseAdmin)
  await next()
})

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.route('/api/employees', employeesRouter)
app.route('/api/approvals', approvalsRouter)
app.route('/api/dashboard', dashboardRouter)
app.route('/api/attendance', attendanceRouter)
app.route('/api/payroll', payrollRouter)
app.route('/api/recruitment', recruitmentRouter)
app.route('/api/training', trainingRouter)
app.route('/api/performance', performanceRouter)

export default app
