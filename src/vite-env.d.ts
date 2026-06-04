// 引用 Vite 內置的客戶端類型定義
// 這一行讓 TypeScript 認識 import.meta.env 等 Vite 特有的 API
/// <reference types="vite/client" />

// 自定義環境變量的類型接口
// TypeScript 默認不知道 .env 文件中定義了哪些變量
// 通過聲明此接口，IDE 會提供自動補全和類型檢查
interface ImportMetaEnv {
  // readonly 確保環境變量在運行時不可被修改
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

// 擴展 ImportMeta 接口，將 env 屬性關聯到上面定義的 ImportMetaEnv
// 這樣當代碼中使用 import.meta.env 時，TypeScript 就知道它包含哪些變量及其類型
interface ImportMeta {
  readonly env: ImportMetaEnv
}
