// 導航項數據結構
interface NavItem {
    id: string;
    icon: string;
    title: string;
    label: string;
}

// 主題模式類型
type ThemeMode = "light" | "dark";

// Sidebar 組件接收的 props
interface SidebarProps {
    items: NavItem[];           // 導航菜單列表
    activeIndex: number;        // 當前選中的導航索引
    onIndexChange: (index: number) => void;  // 切換導航的回調函數
    theme: ThemeMode;           // 當前主題模式
    onToggleTheme: () => void;  // 切換主題的回調函數
}

// 主題圖標映射：根據主題顯示對應 emoji
const themeIconMap: Record<ThemeMode, string> = {
    light: "☀️",
    dark: "🌙"
};

// 主題文字標籤映射
const themeLabelMap: Record<ThemeMode, string> = {
    light: "亮色",
    dark: "暗色"
};

export const Sidebar = ({items, activeIndex, onIndexChange, theme, onToggleTheme}: SidebarProps) => {

    const basicNavItems: NavItem[] = items.slice(0, 3);

    const highLevelNavItems: NavItem[] = items.slice(3);


    return (
        <aside
            className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800">
            {/* Logo 區域 */}
            <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    HRM System
                </h1>
            </div>

            {/* 導航菜單列表 */}
            <nav className="overflow-y-auto p-4 space-y-2">
                <div className={'dark:text-slate-600 text-gray-400 text-sm mb-2'}>基礎模塊</div>
                {basicNavItems.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => onIndexChange(index)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeIndex === index
                            ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.title}</span>
                    </button>
                ))}
            </nav>

            {/* 進階模塊 */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className={'dark:text-slate-600 text-gray-400 text-sm mb-2'}>進階模塊</div>
                {highLevelNavItems.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => onIndexChange(index + 3)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeIndex === index + 3
                            ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.title}</span>
                    </button>
                ))}
            </nav>

            {/* 主題切換按鈕 */}
            <div className="relative p-4 border-t border-slate-200 dark:border-zinc-800">
                <button
                    onClick={onToggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {/* 左側：顯示當前主題的圖標和文字 */}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        {themeIconMap[theme]} {themeLabelMap[theme]}
                    </span>
                    {/* 右側：Toggle 開關 */}
                    <div className="w-10 h-5 bg-slate-200 dark:bg-zinc-700 rounded-full relative">
                        {/* 開關圓點：dark 模式時向右滑動 */}
                        <div
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}/>
                    </div>
                </button>
            </div>
        </aside>
    );
};
