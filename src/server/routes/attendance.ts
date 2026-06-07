import {Hono} from 'hono'
import {supabaseAdmin} from '../lib/supabase'


const router = new Hono()


/// 獲取所有考勤記錄
router.get('/', async (c) => {
    const {data, error} = await supabaseAdmin
        .from('attendance')
        .select('*')
        .order('created_at', {ascending: false})

    if (error) {
        return c.json({error: error.message}, 500)
    }

    return c.json(data)
})


/// 批量插入考勤測試數據
router.post('/batch', async (c) => {
    const body = await c.req.json()
    const records = Array.isArray(body) ? body : [body]

    console.log('Inserting records:', JSON.stringify(records, null, 2))

    const {data, error} = await supabaseAdmin
        .from('attendance')
        .insert(records)
        .select()

    if (error) {
        console.error('Insert error:', error)
        return c.json({error: error.message}, 400)
    }

    return c.json(data, 201)
})


/// 清空所有考勤數據
router.delete('/all', async (c) => {
    const {error} = await supabaseAdmin
        .from('attendance')
        .delete()
        .gt('id', 0)

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json({success: true})
})

export default router
