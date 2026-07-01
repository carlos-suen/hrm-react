import {Hono} from "hono";
import {getSupabaseAdmin} from "../lib/supabase";

const router = new Hono();



/// 獲取用戶的全部信息
router.get('/', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {name, department, status} = c.req.queries() ?? {}

    let query = supabaseAdmin
        .from('workers')
        .select('*')
        .order('created_at', {ascending: false})

    if (name?.[0]) {
        query = query.ilike('name', `%${name[0]}%`)
    }
    if (department?.[0] && department[0] !== 'all') {
        query = query.eq('department', department[0])
    }
    if (status?.[0] && Number(status[0]) !== 0) {
        query = query.eq('status', Number(status[0]))
    }

    const {data, error} = await query

    if (error) {
        return c.json({error: error.message}, 500)
    }

    return c.json(data)
})


// 批量生成用戶的相關數據
router.post('/', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const body = await c.req.json()

    const {data, error} = await supabaseAdmin
        .from('workers')
        .insert([body])
        .select()

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json(data[0], 201)
})


// 更新用戶數據
router.post('/batch', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const body = await c.req.json()
    const records = Array.isArray(body) ? body : [body]

    const {data, error} = await supabaseAdmin
        .from('workers')
        .insert(records)
        .select()

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json(data, 201)
})

// 刪除所有的用戶數據
router.delete('/all', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {error} = await supabaseAdmin
        .from('workers')
        .delete()
        .gt('id', 0)

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json({success: true})
})

// 更新用戶的數據
router.patch('/:id', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const id = c.req.param('id')
    const body = await c.req.json()

    const {data, error} = await supabaseAdmin
        .from('workers')
        .update(body)
        .eq('id', id)
        .select()

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json(data[0])
})

// 根據用根據用戶id刪除數據
router.delete('/:id', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const id = c.req.param('id')

    const {error} = await supabaseAdmin
        .from('workers')
        .delete()
        .eq('id', id)

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json({success: true})
})

export default router
