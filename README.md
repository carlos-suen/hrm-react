# HRM System — 人力資源管理系統

## 項目簡介

定位：面向企業的人力資源管理系統前端應用，提供員工管理、考勤追蹤、薪資計算、績效評估、招聘流程、培訓管理等核心 HR 功能。

現代化全棧 Web 應用，採用 React 19 + TypeScript 構建，整合 Supabase 後端服務，部署於 Cloudflare Workers。

**狀態**：該項目仍在開發中，已部署至 Cloudflare Workers。

## 技術棧

### 前端框架
- **React 19.2.6** — 最新版 React，支援 Concurrent Features
- **TypeScript 6.0** — 嚴格型別檢查，型別安全
- **Vite 8.0.12** — 極速構建工具，HMR 支援

### 狀態管理
- **Zustand 5.0.14** — 輕量級狀態管理庫，簡潔 API

### UI 與樣式
- **TailwindCSS 4.3** — Utility-first CSS 框架
- **@tailwindcss/vite** — Vite 整合

### 後端服務
- **Supabase** — PostgreSQL 資料庫 + 即時 API + 認證服務
- **@supabase/supabase-js 2.106.2** — Supabase 客戶端 SDK
- **Hono 4.12.23** — 輕量級服務端框架

### 視覺化與交互
- **Recharts 3.8.1** — React 數據視覺化圖表庫
- **@dnd-kit** — 現代化拖拽功能套件（core, sortable, utilities）

### 認證與安全
- **bcryptjs 3.0.3** — 密碼加密（服務端）

### 開發工具
- **ESLint 10.3.0** — 代碼品質檢查
- **tsx 4.22.4** — TypeScript 執行環境
- **concurrently 10.0.3** — 並行執行腳本

## 架構

採用分離式架構，前端與服務端獨立運行：

```
hrm-react/
├── src/
│   ├── app/                # 前端應用
│   │   ├── common/
│   │   │   ├── components/ # React 組件（可複用 UI 元件）
│   │   │   ├── constants/  # 常量定義（主題類別）
│   │   │   ├── models/     # TypeScript 型別定義
│   │   │   └── stores/     # Zustand 狀態管理（authStore）
│   │   └── views/          # 頁面視圖
│   │       ├── notifications/  # 通知設定
│   │       ├── performance/    # 績效評估
│   │       ├── reports/        # 數據統計報表
│   │       ├── settings/       # 系統設定
│   │       ├── Approvals.tsx   # 審批工作流
│   │       ├── Attendance.tsx  # 考勤記錄
│   │       ├── Dashboard.tsx   # 儀表板
│   │       ├── Directory.tsx   # 員工名錄
│   │       ├── Login.tsx       # 登入
│   │       ├── Payroll.tsx     # 薪資管理
│   │       ├── Recruitment.tsx # 招聘流程
│   │       └── Training.tsx    # 培訓管理
│   ├── server/             # 服務端 API
│   │   ├── lib/            # 工具函數
│   │   │   ├── api.ts      # API 封裝
│   │   │   ├── auth.ts     # 認證邏輯
│   │   │   └── supabase.ts # Supabase 客戶端
│   │   ├── routes/         # RESTful API 路由
│   │   │   ├── auth.ts     # 認證（登入、註冊）
│   │   │   ├── employees.ts # 員工管理 CRUD
│   │   │   ├── attendance.ts # 考勤記錄
│   │   │   ├── payroll.ts   # 薪資管理
│   │   │   ├── performance.ts # 績效評估
│   │   │   ├── recruitment.ts # 招聘流程
│   │   │   ├── training.ts   # 培訓管理
│   │   │   ├── approvals.ts  # 審批工作流
│   │   │   ├── dashboard.ts  # 儀表板統計
│   │   │   └── reports.ts    # 報表生成
│   │   ├── server.ts       # Node.js 服務入口
│   │   └── worker.ts       # Cloudflare Workers 入口
│   ├── App.tsx             # 應用根組件
│   └── main.tsx            # 前端入口
├── mock/                   # 模擬數據
└── public/                 # 靜態資源
```

### 業務模組
- **員工管理** — 員工資訊增刪改查、批量操作
- **考勤系統** — 出勤記錄、日曆視圖、統計報表
- **薪資管理** — 薪資計算、明細查詢、批量導入
- **績效評估** — 評估記錄、數據生成、趨勢分析（Recharts 視覺化）
- **招聘流程** — 職位管理、申請追蹤、拖拽排序（@dnd-kit）
- **培訓管理** — 課程安排、進度追蹤
- **審批工作流** — 待審、已審、拒絕狀態管理、拖拽卡片
- **儀表板** — 數據統計圖表（Recharts）
- **報表系統** — 員工、考勤、績效、薪資、離職統計

## 多環境與配置

### 環境變數（.env）
```bash
# Supabase 後端服務
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# JWT 認證密鑰
JWT_SECRET=your_jwt_secret
```

### Cloudflare Workers 配置
- **wrangler.toml** — Workers 部署配置
- **敏感變數管理** — `wrangler secret put` 指令設定機敏配置
- **資源路徑** — `./dist` 靜態資源目錄

### 構建與部署
```bash
# 開發環境（並行運行前端與服務端）
npm run dev:all           # 前端 + 服務端並行啟動

# 單獨運行
npm run dev               # 前端開發伺服器
npm run dev:server        # 服務端 API（http://localhost:3001）

# 代碼品質
npm run lint              # ESLint 檢查

# 生產構建與部署
npm run build             # Vite 構建
npm run deploy            # 構建 + Cloudflare Workers 部署
```

## 安全機制

### 認證與授權
- **bcrypt 密碼加密** — 服務端密碼雜湊存儲
- **Supabase Row Level Security** — 資料庫層級權限控制

### 前端安全
- **環境變數管理** — `.env` 隔離機敏配置
- **Cloudflare Secrets** — Workers 環境變數加密存儲

### API 安全
- **服務端 API 路由** — 敏感操作在服務端執行
- **Supabase Service Role** — 服務端專用金鑰，客戶端無法存取

## 部署平台

- **Cloudflare Workers** — Edge 運算平台，全球 CDN 加速
- **靜態資源** — Cloudflare Assets 自動托管
- **環境變數加密** — Wrangler Secrets 管理

---

**License**: Private Project
**Maintainer**: Carlos Suen