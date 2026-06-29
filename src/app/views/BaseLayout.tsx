import {useEffect, useState} from "react";
import {Content} from "../common/components/Content.tsx";
import {Dashboard} from "./Dashboard.tsx";
import {Directory} from "./Directory.tsx";
import {Approvals} from "./Approvals.tsx";
import {Sidebar} from "../common/components/Sidebar.tsx";
import {MobileSideBar} from "../common/components/MobileSideBar.tsx";
import {Attendance} from "./Attendance.tsx";
import {Payroll} from "./Payroll.tsx";
import {Recruitment} from "./Recruitment.tsx";
import {Training} from "./Training.tsx";
import {Performance} from "./performance/Performance.tsx";
import {Reports} from "./reports/Reports.tsx";
import {NotificationView} from "./notifications/NotificationView.tsx";
import {SettingView} from "./settings/SettingView.tsx";

// 導航菜單配置
const navItems = [
    {id: "dashboard", icon: "📊", title: "數據大盤", label: "Dashboard"},
    {id: "directory", icon: "👥", title: "員工名冊", label: "Directory"},
    {id: "approvals", icon: "✅", title: "請假審批", label: "Approvals"},
    {id: "Attendance", icon: "🕐", title: "考勤管理", label: "Attendance"},
    {id: "Payroll", icon: "💰", title: "薪資管理", label: "Payroll"},
    {id: "Recruitment", icon: "📋", title: "招聘管理", label: "Recruitment"},
    {id: "Training", icon: "🎓", title: "培訓管理", label: "Training"},
    {id: "performance", icon: "🏆", title: "績效管理", label: "Performance"},
    {id: "reports", icon: "📈", title: "報表中心", label: "Reports"},
    {id: "notifications", icon: "🔔", title: "通知中心", label: "Notifications"},
    {id: "settings", icon: "⚙️", title: "系統設置", label: "Settings"},
];

// 主題模式類型：只能是 "light"（亮色）或 "dark"（暗色）
type ThemeMode = "light" | "dark";

// 主題循環順序：亮色 → 暗色 → 亮色（循環）
const themeCycle: ThemeMode[] = ["light", "dark"];

export const BaseLayout = () => {
    // 當前選中的導航標籤索引（0=數據大盤, 1=員工名冊, 2=請假審批）
    const [tabIndex, setTabIndex] = useState(0);

    // 當前主題模式，從 localStorage 讀取初始值，默認為亮色
    const [theme, setTheme] = useState<ThemeMode>(() => {
        return (localStorage.getItem("hrm-theme") as ThemeMode) || "light";
    });

    // 監聽 theme 狀態變化，持久化並同步 HTML 元素的 class
    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("hrm-theme", theme);
    }, [theme]);

    // 切換主題：在亮色和暗色之間循環
    const toggleTheme = () => {
        setTheme(prev => {
            // prev: 當前的主題值（"light" 或 "dark"）
            // themeCycle.indexOf(prev): 找到當前主題在數組中的索引
            const currentIndex = themeCycle.indexOf(prev);

            // (currentIndex + 1) % themeCycle.length: 計算下一個索引
            // 例如: (0 + 1) % 2 = 1 → "dark"
            //      (1 + 1) % 2 = 0 → "light"（循環回到開頭）
            return themeCycle[(currentIndex + 1) % themeCycle.length];
        });
    };

    // 獲取當前選中的導航項
    const activeItem = navItems[tabIndex];

    // 根據 tabIndex 渲染對應的頁面組件
    const renderContent = () => {
        switch (tabIndex) {
            case 0:
                return <Dashboard/>;
            case 1:
                return <Directory/>;
            case 2:
                return <Approvals/>;
            case 3:
                return <Attendance/>
            case 4:
                return <Payroll/>
            case 5:
                return <Recruitment/>
            case 6:
                return <Training/>
            case 7:
                return <Performance/>
            case 8:
                return <Reports/>
            case 9:
                return <NotificationView/>
            case 10:
                return <SettingView/>
            default:
                return <Dashboard/>;
        }
    };

    return (
        <main className="bg-slate-50 dark:bg-zinc-950 h-screen flex flex-col md:flex-row">
            <Sidebar
                items={navItems}
                activeIndex={tabIndex}
                onIndexChange={setTabIndex}
                theme={theme}
                onToggleTheme={toggleTheme}
            />

            <MobileSideBar
                items={navItems}
                activeIndex={tabIndex}
                onIndexChange={setTabIndex}
                theme={theme}
                onToggleTheme={toggleTheme}
            />

            <div className="ml-0 md:ml-64 flex-1 h-full overflow-hidden">
                <Content
                    title={activeItem?.title ?? ""}
                    subtitle={activeItem?.label ?? ""}
                >
                    {renderContent()}
                </Content>
            </div>
        </main>
    );
};
