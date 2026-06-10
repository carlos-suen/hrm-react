import {useState} from "react";
import {ReportDataCard} from "../reports/components/ReportDataCard.tsx";
import {InfoDialog} from "../../common/components/InfoDialog.tsx";

const workingDaysList = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];

interface ApprovalStep {
    id: number;
    label: string;
}

interface TaxBracket {
    id: number;
    lower: string;
    upper: string;
    rate: string;
}

const LeaveSettingsForm = () => {
    const [defaultDays, setDefaultDays] = useState("10");
    const [carryLimit, setCarryLimit] = useState("5");
    const [steps, setSteps] = useState<ApprovalStep[]>([
        {id: 1, label: "主管審批"},
        {id: 2, label: "HR 審批"},
    ]);

    const removeStep = (id: number) => {
        setSteps(prev => prev.filter(s => s.id !== id));
    };

    const addStep = () => {
        const newId = Math.max(0, ...steps.map(s => s.id)) + 1;
        setSteps(prev => [...prev, {id: newId, label: `審批環節 ${newId}`}]);
    };

    const flowPreview = steps.map(s => s.label.replace("審批", "").trim()).join(" → ");

    return (
        <div className="space-y-4">
            {/* 默認年假天數 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    默認年假天數 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={defaultDays}
                        onChange={e => setDefaultDays(e.target.value)}
                        className="w-48 px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">天</span>
                </div>
            </div>

            {/* 結轉上限 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    結轉上限
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={carryLimit}
                        onChange={e => setCarryLimit(e.target.value)}
                        className="w-48 px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">天（0 = 不允許結轉）</span>
                </div>
            </div>

            {/* 審批流程 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    審批流程
                </label>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">拖拽排序審批環節，點擊 × 刪除</p>
                <div className="space-y-2">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-zinc-700/50 rounded-lg border border-slate-200 dark:border-zinc-600"
                        >
                            <span className="text-slate-400 cursor-grab active:cursor-grabbing select-none"></span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">
                                {index + 1}. {step.label}
                            </span>
                            <button
                                onClick={() => removeStep(step.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={addStep}
                    className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                    + 添加審批環節
                </button>
            </div>

            {/* 預覽 */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    預覽：年假 {defaultDays} 天，可結轉 {carryLimit} 天，審批流程：{flowPreview || "無"}
                </p>
            </div>
        </div>
    );
};

const PayrollSettingsForm = () => {
    const [payDay, setPayDay] = useState("15");
    const [currency, setCurrency] = useState("CNY ¥");
    const [brackets, setBrackets] = useState<TaxBracket[]>([
        {id: 1, lower: "0", upper: "3,000", rate: "3"},
        {id: 2, lower: "3,000", upper: "12,000", rate: "10"},
        {id: 3, lower: "12,000", upper: "25,000", rate: "20"},
    ]);

    const removeBracket = (id: number) => {
        setBrackets(prev => prev.filter(b => b.id !== id));
    };

    const addBracket = () => {
        const lastBracket = brackets[brackets.length - 1];
        const newLower = lastBracket ? lastBracket.upper : "0";
        const newId = Math.max(0, ...brackets.map(b => b.id)) + 1;
        setBrackets(prev => [...prev, {id: newId, lower: newLower, upper: "", rate: ""}]);
    };

    const updateBracket = (id: number, field: keyof TaxBracket, value: string) => {
        setBrackets(prev => prev.map(b => b.id === id ? {...b, [field]: value} : b));
    };

    return (
        <div className="space-y-4">
            {/* 發薪日 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    發薪日 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={payDay}
                        onChange={e => setPayDay(e.target.value)}
                        className="w-48 px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">號（1-28）</span>
                </div>
            </div>

            {/* 貨幣 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    貨幣
                </label>
                <input
                    type="text"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-48 px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* 稅率表 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    稅率表
                </label>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-zinc-700/50">
                                <th className="text-left px-3 py-2 font-medium text-slate-600 dark:text-slate-400">區間下限</th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600 dark:text-slate-400">區間上限</th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600 dark:text-slate-400">稅率(%)</th>
                                <th className="text-left px-3 py-2 font-medium text-slate-600 dark:text-slate-400">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brackets.map((bracket, index) => (
                                <tr key={bracket.id} className={index % 2 === 0 ? "bg-white dark:bg-zinc-800" : "bg-slate-50 dark:bg-zinc-700/30"}>
                                    <td className="px-3 py-2">
                                        <span className="text-slate-700 dark:text-slate-300">¥{bracket.lower}</span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            value={bracket.upper}
                                            onChange={e => updateBracket(bracket.id, "upper", e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            type="text"
                                            value={bracket.rate}
                                            onChange={e => updateBracket(bracket.id, "rate", e.target.value)}
                                            className="w-24 px-2 py-1 text-sm border border-slate-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <button
                                            onClick={() => removeBracket(bracket.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            刪除
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={addBracket}
                    className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                    + 添加稅率區間
                </button>
            </div>
        </div>
    );
};

const CompanyInfoForm = () => {
    const [companyName, setCompanyName] = useState("ABC 科技有限公司");
    const [logoUrl, setLogoUrl] = useState("");
    const [fiscalStart, setFiscalStart] = useState("01-01");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");
    const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5]);

    const toggleDay = (day: number) => {
        setWorkingDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
        );
    };

    const dayLabels = workingDays.map(d => workingDaysList[d - 1]).join("、");

    return (
        <div className="space-y-4">
            {/* 公司名稱 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    公司名稱 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Logo URL */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Logo URL
                </label>
                <input
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="輸入公司 Logo 圖片 URL..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* 財年起始 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    財年起始 (MM-DD)
                </label>
                <input
                    type="text"
                    value={fiscalStart}
                    onChange={e => setFiscalStart(e.target.value)}
                    className="w-48 px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* 上班/下班時間 */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        上班時間
                    </label>
                    <input
                        type="text"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        下班時間
                    </label>
                    <input
                        type="text"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* 工作日 */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    工作日
                </label>
                <div className="flex flex-wrap gap-3">
                    {workingDaysList.map((day, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={workingDays.includes(i + 1)}
                                onChange={() => toggleDay(i + 1)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{day}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 預覽 */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    預覽：工作時間 {startTime}-{endTime}，{dayLabels || "無"}
                </p>
            </div>
        </div>
    );
};

export const SettingView = () => {
    const [showCompanyDialog, setShowCompanyDialog] = useState(false);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [showPayrollDialog, setShowPayrollDialog] = useState(false);

    const settingItems = [
        {id: "company", label: "公司信息", desc: "公司名稱、財年、工作時間", icon: "", color: "bg-blue-100"},
        {id: "leave", label: "假期設置", desc: "年假天數、結轉限制、審批流程", icon: "", color: "bg-green-100"},
        {id: "attendance", label: "考勤設置", desc: "遲到閾值、早退閾值、加班規則", icon: "🕐", color: "bg-orange-100"},
        {id: "payroll", label: "薪資設置", desc: "發薪日、稅率表", icon: "", color: "bg-purple-100"},
    ];

    const handleCardClick = (id: string) => {
        if (id === "company") {
            setShowCompanyDialog(true);
        } else if (id === "leave") {
            setShowLeaveDialog(true);
        } else if (id === "payroll") {
            setShowPayrollDialog(true);
        } else {
            window.location.href = `/settings/${id}`;
        }
    };

    return (
        <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">系統設置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingItems.map(item => (
                    <ReportDataCard
                        key={item.id}
                        {...item}
                        onViewReport={() => handleCardClick(item.id)}
                        buttonLabel="進入設置 →"
                    />
                ))}
            </div>

            <InfoDialog
                isOpen={showCompanyDialog}
                title="公司信息"
                content={<CompanyInfoForm/>}
                cancelText="取消"
                confirmText="保存設置"
                onCancel={() => setShowCompanyDialog(false)}
                onConfirm={() => {
                    // TODO: [Technical Debt] 接入實際保存 API
                    setShowCompanyDialog(false);
                }}
                maxWidth="max-w-2xl"
            />

            <InfoDialog
                isOpen={showLeaveDialog}
                title="假期設置"
                content={<LeaveSettingsForm/>}
                cancelText="取消"
                confirmText="保存設置"
                onCancel={() => setShowLeaveDialog(false)}
                onConfirm={() => {
                    // TODO: [Technical Debt] 接入實際保存 API
                    setShowLeaveDialog(false);
                }}
                maxWidth="max-w-2xl"
            />

            <InfoDialog
                isOpen={showPayrollDialog}
                title="薪資設置"
                content={<PayrollSettingsForm/>}
                cancelText="取消"
                confirmText="保存設置"
                onCancel={() => setShowPayrollDialog(false)}
                onConfirm={() => {
                    // TODO: [Technical Debt] 接入實際保存 API
                    setShowPayrollDialog(false);
                }}
                maxWidth="max-w-2xl"
            />
        </section>
    );
};
