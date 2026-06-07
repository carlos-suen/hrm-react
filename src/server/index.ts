import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import employeesRouter from './routes/employees'
import approvalsRouter from './routes/approvals'
import dashboardRouter from './routes/dashboard'
import attendanceRouter from './routes/attendance'
import payrollRouter from './routes/payroll'
import recruitmentRouter from './routes/recruitment'
import trainingRouter from './routes/training'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.route('/api/employees', employeesRouter)
app.route('/api/approvals', approvalsRouter)
app.route('/api/dashboard', dashboardRouter)
app.route('/api/attendance', attendanceRouter)
app.route('/api/payroll', payrollRouter)
app.route('/api/recruitment', recruitmentRouter)
app.route('/api/training', trainingRouter)

export default app
