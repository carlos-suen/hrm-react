import {useState} from "react";

type NotificationType = "all" | "leave" | "attendance" | "payroll" | "performance" | "system";

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    description: string;
    date: string;
    read: boolean;
    icon: string;
    iconBg: string;
    iconColor: string;
}

const typeLabels: Record<NotificationType, string> = {
    all: "全部",
    leave: "請假",
    attendance: "考勤",
    payroll: "薪資",
    performance: "績效",
    system: "系統",
};

const iconConfig: Record<string, { icon: string; bg: string; color: string }> = {
    performance: {icon: "📋", bg: "bg-purple-100 dark:bg-purple-900/30", color: "text-purple-600"},
    attendance: {icon: "🕐", bg: "bg-orange-100 dark:bg-orange-900/30", color: "text-orange-600"},
    leave: {icon: "🕐", bg: "bg-blue-100 dark:bg-blue-900/30", color: "text-blue-600"},
    payroll: {icon: "💰", bg: "bg-green-100 dark:bg-green-900/30", color: "text-green-600"},
    system: {icon: "🕐", bg: "bg-slate-100 dark:bg-slate-700", color: "text-slate-600"},
};

const mockNotifications: Notification[] = [
    {
        id: 1, type: "performance", title: "績效評估待完成",
        description: "2026-H1 績效自評截止日期：6/15",
        date: "6/2", read: false, ...iconConfig.performance,
    },
    {
        id: 2, type: "attendance", title: "考勤異常提醒",
        description: "李娜今日遲到（09:45打卡）",
        date: "6/3", read: false, ...iconConfig.attendance,
    },
    {
        id: 3, type: "leave", title: "請假申請待審批",
        description: "張偉提交了年假申請（6/5-6/7，3天）",
        date: "6/3", read: false, ...iconConfig.leave,
    },
    {
        id: 4, type: "payroll", title: "薪資單已確認",
        description: "2026年5月薪資單已生成，請確認",
        date: "6/1", read: true, ...iconConfig.payroll,
    },
    {
        id: 5, type: "system", title: "系統維護通知",
        description: "系統將於6/8 02:00-04:00進行維護",
        date: "5/30", read: true, ...iconConfig.system,
    },
];

export const NotificationView = () => {
    const [activeTab, setActiveTab] = useState<NotificationType>("all");
    const [notifications, setNotifications] = useState(mockNotifications);

    const filtered = activeTab === "all"
        ? notifications
        : notifications.filter(n => n.type === activeTab);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({...n, read: true})));
    };

    const markRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
    };

    const tabs: NotificationType[] = ["all", "leave", "attendance", "payroll", "performance", "system"];

    return (
        <section>
            {/* 標題 + 操作欄 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className={`flex gap-2 items-center`}>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">通知中心</h2>
                    <button
                        onClick={() => {
                            window.location.href = '/notifications/settings';
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        ⚙
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                        🔔
                        {unreadCount > 0 && (
                            <span
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={markAllRead}
                        className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        全部已讀
                    </button>
                </div>
            </div>

            {/* 分類標籤 */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-600"
                        }`}
                    >
                        {typeLabels[tab]}
                    </button>
                ))}
            </div>

            {/* 通知列表 */}
            <div className="space-y-3">
                {filtered.map(notif => (
                    <div
                        key={notif.id}
                        className={`rounded-xl p-4 flex items-start gap-4 transition-colors ${
                            notif.read
                                ? "border-l-4 border-green-500 bg-white dark:bg-zinc-800/50"
                                : "border-l-4 border-red-500 bg-white dark:bg-zinc-800"
                        }`}
                    >
                        {/* 圖標 */}
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${notif.iconBg}`}>
                            {notif.icon}
                        </div>

                        {/* 內容 */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{notif.title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.description}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-xs text-slate-400">{notif.date}</span>
                                    {!notif.read && (
                                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full"/>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                    查看詳情
                                </button>
                                {!notif.read && (
                                    <>
                                        <span className="text-slate-300 dark:text-zinc-600">|</span>
                                        <button
                                            onClick={() => markRead(notif.id)}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                        >
                                            標記已讀
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
