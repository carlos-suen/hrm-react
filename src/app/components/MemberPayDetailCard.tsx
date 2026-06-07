import { cardClasses } from "../common/themeClasses.tsx";
import type { PayRecord } from "./PayMemberDetailTable.tsx";

interface MemberPayDetailCardProps {
    record: PayRecord;
    onCollapse: () => void;
    onConfirm: () => void;
    onPay: () => void;
}

export const MemberPayDetailCard = ({ record, onCollapse: _onCollapse, onConfirm, onPay }: MemberPayDetailCardProps) => {
    const detailItems = [
        { label: "基本工資", value: record.baseSalary, color: "text-slate-900 dark:text-white" },
        { label: "績效獎金", value: record.bonus, color: "text-green-600 dark:text-green-400" },
        { label: "扣款", value: record.deduction, color: "text-red-600 dark:text-red-400" },
        { label: "五險一金", value: "-¥2,940", color: "text-slate-500 dark:text-slate-400" },
        { label: "個人所得稅", value: "-¥1,632", color: "text-slate-500 dark:text-slate-400" },
    ];

    return (
        <div className={`${cardClasses} mt-6`}>
            {/* 時間 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {record.name} · {record.department} · 2026-01
                </h3>
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-5 gap-6 grid-cols-1">
                {/* 基本信息, 調整使用grid控制不對稱, flex無法精確還原 */}
                <div className={`space-y-3 ${cardClasses} md:col-span-2 col-span-1`}>
                    {detailItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                            <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                            <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                        </div>
                    ))}
                </div>

                {/*  */}
                <div className={`md:col-span-3 col-span-1 ${cardClasses} flex flex-col justify-between`}>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">實發工資</span>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{record.netPay}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">薪資狀態</span>
                            <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${record.status === 'Draft' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {record.status}
                        </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            確認
                        </button>
                        <button
                            onClick={onPay}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            發放
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
