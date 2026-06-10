import {useState} from "react";
import {AppSwitch} from "../../common/components/AppSwitch.tsx";
import {cardClasses} from "../../common/constants/themeClasses.tsx";

type Frequency = "realtime" | "daily" | "weekly";

interface SubSetting {
    id: string;
    label: string;
    enabled: boolean;
}

interface CategorySetting {
    id: string;
    icon: string;
    label: string;
    color: string;
    items: SubSetting[];
}

export const NotificationSettingView = () => {
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [pushEnabled, setPushEnabled] = useState(false);
    const [frequency, setFrequency] = useState<Frequency>("realtime");

    const [categories, setCategories] = useState<CategorySetting[]>([
        {
            id: "leave", icon: "", label: "請假通知", color: "text-blue-600",
            items: [
                {id: "leave-new", label: "新申請通知", enabled: true},
                {id: "leave-result", label: "審批結果通知", enabled: true},
            ],
        },
        {
            id: "attendance", icon: "🕐", label: "考勤通知", color: "text-orange-600",
            items: [
                {id: "attendance-abnormal", label: "異常打卡通知", enabled: true},
            ],
        },
        {
            id: "payroll", icon: "", label: "薪資通知", color: "text-green-600",
            items: [
                {id: "payroll-confirm", label: "薪資確認通知", enabled: false},
            ],
        },
        {
            id: "performance", icon: "🏆", label: "績效通知", color: "text-purple-600",
            items: [
                {id: "performance-pending", label: "評估待辦通知", enabled: true},
            ],
        },
    ]);

    const toggleSubItem = (categoryId: string, itemId: string) => {
        setCategories(prev => prev.map(cat =>
            cat.id === categoryId
                ? {...cat, items: cat.items.map(item =>
                    item.id === itemId ? {...item, enabled: !item.enabled} : item
                )}
                : cat
        ));
    };

    return (
        <section className="max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">通知設置</h2>

            {/* 通知渠道 */}
            <div className={`${cardClasses} p-6 mb-6`}>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">通知渠道</h3>
                <AppSwitch label="郵件通知" enabled={emailEnabled} onChange={setEmailEnabled}/>
                <AppSwitch label="推送通知" enabled={pushEnabled} onChange={setPushEnabled}/>

                {/* 摘要頻率 */}
                <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-zinc-700">
                    <span className="text-sm text-slate-700 dark:text-slate-300">摘要頻率</span>
                    <div className="flex items-center gap-4">
                        {([
                            {value: "realtime", label: "實時"},
                            {value: "daily", label: "每日"},
                            {value: "weekly", label: "每週"},
                        ] as const).map(opt => (
                            <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                    type="radio"
                                    name="frequency"
                                    value={opt.value}
                                    checked={frequency === opt.value}
                                    onChange={() => setFrequency(opt.value)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* 通知類別 */}
            <div className={`${cardClasses} p-6`}>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">通知類別</h3>
                {categories.map((cat, catIndex) => (
                    <div key={cat.id}>
                        {catIndex > 0 && <div className="border-t border-slate-100 dark:border-zinc-700 my-3"/>}
                        <div className={`text-sm font-semibold ${cat.color} mb-2`}>
                            {cat.icon} {cat.label}
                        </div>
                        {cat.items.map(item => (
                            <div key={item.id} className="pl-4">
                                <AppSwitch
                                    label={item.label}
                                    enabled={item.enabled}
                                    onChange={() => toggleSubItem(cat.id, item.id)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};
