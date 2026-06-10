import { Hono } from 'hono'
import { getSupabaseAdmin } from "../lib/supabase";

const router = new Hono();

// 獲取全部的績效數據
router.get('/', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c);
    const { data, error } = await supabaseAdmin
        .from('performance')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return c.json({ error: error.message }, 500);
    }

    return c.json(data);
});


router.get('/getById/:id', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c);
    const id = c.req.param('id');

    const { data, error } = await supabaseAdmin
        .from('performance')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return c.json({ error: error.message }, 404);
    }

    return c.json(data);
});

// 生成測試數據
router.post('/generateData', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c);
    const body = await c.req.json();
    const records = Array.isArray(body) ? body : [body];

    const { data, error } = await supabaseAdmin
        .from('performance')
        .insert(records)
        .select();

    if (error) {
        return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
});

// 批量刪除所有績效數據
router.delete('/deleteAll', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c);
    const { error } = await supabaseAdmin
        .from('performance')
        .delete()
        .gt('id', 0);

    if (error) {
        return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true }, 200);
});

// 添加績效記錄
router.post('/add', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c);
    const body = await c.req.json();
    const records = Array.isArray(body) ? body : [body];

    const { data, error } = await supabaseAdmin
        .from('performance')
        .insert(records)
        .select();

    if (error) {
        return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
});

// 刪除單條績效記錄
router.delete('/:id', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c);
    const id = c.req.param('id');

    const { error } = await supabaseAdmin
        .from('performance')
        .delete()
        .eq('id', id);

    if (error) {
        return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
});

// 獲取/更新單條績效詳情
router.patch('/:id', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c);
    const id = c.req.param('id');
    const body = await c.req.json();

    const { data, error } = await supabaseAdmin
        .from('performance')
        .update(body)
        .eq('id', id)
        .select();

    if (error) {
        return c.json({ error: error.message }, 400);
    }

    return c.json(data[0]);
});

export default router;
