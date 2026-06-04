// 導入 Supabase JS SDK 的客戶端創建方法
import { createClient } from '@supabase/supabase-js'

// 從 Vite 環境變量中讀取 Supabase 配置
// VITE_ 前綴是 Vite 的約定，只有帶此前綴的變量才會暴露到客戶端代碼
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// 創建並導出 Supabase 客戶端實例
// 整個應用共享此實例，避免重複創建連接
export const supabase = createClient(supabaseUrl, supabaseKey)
