import {router} from "../lib/api";
import {getSupabaseAdmin} from "../lib/supabase";


/// 獲取部門人數統計（餅圖數據）
router.get('/department-stats', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {data, error} = await supabaseAdmin
        .from('workers')
        .select('department')

    if (error) {
        return c.json({error: error.message}, 500)
    }

    const departmentCount: Record<string, number> = {}
    data?.forEach(item => {
        departmentCount[item.department] = (departmentCount[item.department] || 0) + 1
    })

    const result = Object.entries(departmentCount).map(([name, value]) => ({
        name,
        value
    }))

    return c.json(result)
})


/// 獲取部門平均薪資統計（柱狀圖數據）
router.get('/salary-stats', async (c) => {
    const supabaseAdmin = getSupabaseAdmin(c)
    const {data, error} = await supabaseAdmin
        .from('workers')
        .select('department, sal')

    if (error) {
        return c.json({error: error.message}, 500)
    }

    const departmentSalary: Record<string, { total: number; count: number }> = {}
    data?.forEach(item => {
        if (!departmentSalary[item.department]) {
            departmentSalary[item.department] = {total: 0, count: 0}
        }
        departmentSalary[item.department].total += item.sal
        departmentSalary[item.department].count += 1
    })

    const result = Object.entries(departmentSalary).map(([name, {total, count}]) => ({
        name,
        value: Math.round(total / count)
    }))

    return c.json(result)
})

export default router
