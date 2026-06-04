// 導航項數據結構
interface NavItem {
    id: string;
    icon: string;
    title: string;
    label: string;
}

// 主題模式類型
type ThemeMode = "light" | "dark";

// MobileNav 組件接收的 props
interface MobileNavProps {
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

export const MobileNav = ({items, activeIndex, onIndexChange, theme, onToggleTheme}: MobileNavProps) => {
    return (
        <div className="md:hidden">
            {/* 頂部導航欄：漢堡菜單 + 標題 + 主題切換按鈕 */}
            <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                <button className="text-slate-600 dark:text-slate-400">
                    ☰
                </button>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                     HRM
                </h1>
                {/* 主題切換按鈕：點擊觸發 onToggleTheme 回調 */}
                <button
                    onClick={onToggleTheme}
                    className="text-slate-600 dark:text-slate-400"
                >
                    {themeIconMap[theme]}
                </button>
            </header>

            {/* 水平滾動的導航標籤欄 */}
            <nav className="flex overflow-x-auto bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                {items.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => onIndexChange(index)}
                        className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                            activeIndex === index
                                ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                                : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <span className="mr-2">{item.icon}</span>
                        {item.title}
                    </button>
                ))}
            </nav>
        </div>
    );
};
