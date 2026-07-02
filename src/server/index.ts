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

// 認證相關：登錄、註冊、拿當前登錄用戶
app.route('/api/auth', authRouter)
// 員工通訊錄：增刪改查 + 批量生成
app.route('/api/employees', employeesRouter)
// 審批流：待處理 / 已批 / 已拒，以及狀態流轉
app.route('/api/approvals', approvalsRouter)
// 儀表盤：部門人數、平均薪資這類圖表聚合數據
app.route('/api/dashboard', dashboardRouter)
// 考勤打卡記錄
app.route('/api/attendance', attendanceRouter)
// 薪資單：列表、詳情、改狀態（確認 / 發放）
app.route('/api/payroll', payrollRouter)
// 招聘職位管理
app.route('/api/recruitment', recruitmentRouter)
// 培訓課程：建課、報名、清空
app.route('/api/training', trainingRouter)
// 績效考核：評估記錄的增刪改查
app.route('/api/performance', performanceRouter)

export default app
