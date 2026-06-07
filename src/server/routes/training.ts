import {Hono} from 'hono'
import {supabaseAdmin} from '../lib/supabase'


const router = new Hono()


/// 獲取所有培訓記錄
router.get('/', async (c) => {
    const {data, error} = await supabaseAdmin
        .from('training')
        .select('*')
        .order('created_at', {ascending: false})

    if (error) {
        return c.json({error: error.message}, 500)
    }

    return c.json(data)
})


/// 批量插入培訓數據
router.post('/batch', async (c) => {
    const body = await c.req.json()
    const records = Array.isArray(body) ? body : [body]

    const {data, error} = await supabaseAdmin
        .from('training')
        .insert(records)
        .select()

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json(data, 201)
})


/// 創建單條培訓記錄
router.post('/', async (c) => {
    const body = await c.req.json()

    const {data, error} = await supabaseAdmin
        .from('training')
        .insert(body)
        .select()

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json(data[0], 201)
})


// 刪除所有的數據
router.delete('/all', async (c)=>{
    const {error} = await supabaseAdmin
        .from('training')
        .delete()
        .neq('id', 0)
    if (error) {
        return c.json({error: error.message}, 400)
    }
    return c.json({message: '所有培訓記錄已刪除'})
});


/// 獲取單條培訓詳情
router.get('/:id', async (c) => {
    const id = c.req.param('id')

    const {data, error} = await supabaseAdmin
        .from('training')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return c.json({error: error.message}, 404)
    }

    return c.json(data)
})


/// 更新培訓記錄
router.patch('/:id', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()

    // 如果是報名操作，遞增 current_join
    if (body.current_join === 1) {
        const {data: existing, error: fetchError} = await supabaseAdmin
            .from('training')
            .select('current_join, max_people')
            .eq('id', id)
            .single()

        if (fetchError) {
            return c.json({error: fetchError.message}, 404)
        }

        if (existing.current_join >= existing.max_people) {
            return c.json({error: '課程已滿員'}, 400)
        }

        const {data, error} = await supabaseAdmin
            .from('training')
            .update({ current_join: (existing.current_join || 0) + 1 })
            .eq('id', id)
            .select()

        if (error) {
            return c.json({error: error.message}, 400)
        }

        return c.json(data[0])
    }

    const {data, error} = await supabaseAdmin
        .from('training')
        .update(body)
        .eq('id', id)
        .select()

    if (error) {
        return c.json({error: error.message}, 400)
    }

    return c.json(data[0])
})


export default router
