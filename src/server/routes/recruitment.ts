import {Hono} from 'hono'
import {getSupabaseAdmin} from '../lib/supabase'


const router = new Hono()


/// 獲取所有招聘記錄
router.get('/', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {data, error} = await supabaseAdmin
        .from('recruitment')
        .select('*')
        .order('created_at', {ascending: false})

    if (error) {
        return c.json({error: error.message}, 500)
    }

    return c.json(data)
})


/// 批量插入招聘數據
router.post('/batch', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const body = await c.req.json()
    const records = Array.isArray(body) ? body : [body]

    const {data, error} = await supabaseAdmin
        .from('recruitment')
        .insert(records)
        .select()

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json(data, 201)
})


/// 獲取單條招聘詳情
router.get('/:id', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const id = c.req.param('id')

    const {data, error} = await supabaseAdmin
        .from('recruitment')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return c.json({error: error.message}, 404)
    }

    return c.json(data)
})


/// 更新招聘記錄
router.patch('/:id', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const id = c.req.param('id')
    const body = await c.req.json()

    const {data, error} = await supabaseAdmin
        .from('recruitment')
        .update(body)
        .eq('id', id)
        .select()

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json(data[0])
})


export default router
