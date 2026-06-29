import {Hono} from "hono";
import {getSupabaseAdmin} from "../lib/supabase";

const router = new Hono();


/// 獲取所有待處理
router.get('/pending', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {data, error} = await supabaseAdmin.from("approvals").select("*").eq("status", 0);

    if (error) {
        return c.json({error: error.message}, 500);
    }

    return c.json(data);
});


/// 獲取所有已批准
router.get('/approved', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {data, error} = await supabaseAdmin.from('approvals').select("*").eq("status", 1);

    if (error) {
        return c.json({error: error.message}, 500);
    }

    return c.json(data);
});


/// 獲取所有已拒絕
router.get('/rejected', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {data, error} = await supabaseAdmin.from('approvals').select("*").eq("status", 2);

    if (error) {
        return c.json({error: error.message}, 500);
    }

    return c.json(data);
});


/// 更新審批狀態
router.patch('/:id', async (c) => {
    try {
        const supabaseAdmin = getSupabaseAdmin(c)
        const id = c.req.param('id');
        const body = await c.req.json();

        console.log('[PATCH /approvals/:id] Request:', { id, body });
        console.log('[PATCH /approvals/:id] Supabase client exists:', !!supabaseAdmin);

        const {data, error, status, statusText} = await supabaseAdmin
            .from('approvals')
            .update(body)
            .eq('id', id)
            .select();

        console.log('[PATCH /approvals/:id] Supabase response:', {
            data,
            error,
            status,
            statusText
        });

        if (error) {
            console.error('[PATCH /approvals/:id] Supabase error:', error);
            return c.json({error: error.message}, 400);
        }

        if (!data || data.length === 0) {
            console.warn('[PATCH /approvals/:id] No data returned, id might not exist:', id);
            return c.json({error: 'Approval not found'}, 404);
        }

        return c.json(data[0]);
    } catch (err) {
        console.error('[PATCH /approvals/:id] Unhandled error:', err);
        return c.json({error: 'Internal server error'}, 500);
    }
});


/// 批量插入測試數據
router.post('/batch', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const body = await c.req.json();
    const records = Array.isArray(body) ? body : [body];

    const {data, error} = await supabaseAdmin
        .from('approvals')
        .insert(records)
        .select();

    if (error) {
        return c.json({error: error.message}, 400);
    }

    return c.json(data, 201);
});


/// 清空所有數據
router.delete('/all', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {error} = await supabaseAdmin
        .from('approvals')
        .delete()
        .gt('id', 0);

    if (error) {
        return c.json({error: error.message}, 400);
    }

    return c.json({success: true});
});

export default router;
