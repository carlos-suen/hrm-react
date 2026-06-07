import {router} from "../lib/api";
import {getSupabaseAdmin} from "../lib/supabase";


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
    const supabaseAdmin = getSupabaseAdmin(c)
    const id = c.req.param('id');
    const body = await c.req.json();

    const {data, error} = await supabaseAdmin
        .from('approvals')
        .update(body)
        .eq('id', id)
        .select();

    if (error) {
        return c.json({error: error.message}, 400);
    }

    return c.json(data[0]);
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
