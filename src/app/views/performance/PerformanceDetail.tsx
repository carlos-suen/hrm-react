import {RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer} from "recharts";

interface DimensionScore {
    dimension: string;
    current: number;
    previous: number;
}

interface ApprovalStep {
    label: string;
    status: 'completed' | 'current' | 'pending';
}

const radarData: DimensionScore[] = [
    {dimension: '質量', current: 4.5, previous: 4.0},
    {dimension: '效率', current: 4.0, previous: 4.2},
    {dimension: '協作', current: 4.5, previous: 4.2},
    {dimension: '主動', current: 4.0, previous: 3.5},
    {dimension: '溝通', current: 3.5, previous: 3.5},
];

const approvalSteps: ApprovalStep[] = [
    {label: '自評', status: 'completed'},
    {label: '主管審核', status: 'completed'},
    {label: 'HR審核', status: 'completed'},
    {label: '完成', status: 'completed'},
];

const scoreDetails = [
    {name: '工作質量', score: 4.5, previous: 4.0, change: 0.5},
    {name: '工作效率', score: 4.0, previous: 4.2, change: -0.2},
    {name: '團隊協作', score: 4.5, previous: 4.2, change: 0.3},
    {name: '主動性', score: 4.0, previous: 3.5, change: 0.5},
    {name: '溝通能力', score: 3.5, previous: 3.5, change: 0},
];


const cardClass = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700';

const renderApprovalIcon = (step: ApprovalStep) => {
    if (step.status === 'completed') {
        return (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
        );
    }
    if (step.status === 'current') {
        return (
            <div
                className="w-8 h-8 rounded-full bg-blue-500 animate-pulse flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-full"/>
            </div>
        );
    }
    return (
        <div
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 bg-slate-400 dark:bg-zinc-500 rounded-full"/>
        </div>
    );
};

// todo 後期補充數據之後需要完善參數
// interface PerformanceDetailProps {
//     // id: number;
//
// }

export const PerformanceDetail = () => {


    const defaultOnBack = () => {
        window.history.back()
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto w-full space-y-4 pb-8">
                {/* 頂部標題 */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">績效詳情 — 張偉</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">2026-H1 | Engineering | 評審人:
                            王強</p>
                    </div>
                </div>

                {/* 員工資訊卡片 */}
                <div className={`${cardClass} p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            張
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white">張偉</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Engineering · Senior Developer
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-500 dark:text-slate-400">評估週期</div>
                        <div className="font-semibold text-slate-900 dark:text-white">2026-H1</div>
                    </div>
                </div>

                {/* 雷達圖 + 評分明細 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 雷達圖 */}
                    <div className={`${cardClass} p-4`}>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">五維能力雷達圖</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-zinc-700"/>
                                <PolarAngleAxis dataKey="dimension" tick={{fill: 'currentColor', fontSize: 12}}
                                                className="text-slate-600 dark:text-slate-400"/>
                                <Radar name="本期" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2}/>
                                <Radar name="上期" dataKey="previous" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1}
                                       strokeDasharray="5 5"/>
                                <Legend/>
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 評分明細 */}
                    <div className={`${cardClass} p-4`}>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">評分明細</h3>
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-zinc-700">
                                <th className="pb-2 font-medium">維度</th>
                                <th className="pb-2 font-medium">分數</th>
                                <th className="pb-2 font-medium">進度</th>
                                <th className="pb-2 font-medium">上期</th>
                                <th className="pb-2 font-medium">變化</th>
                            </tr>
                            </thead>
                            <tbody>
                            {scoreDetails.map((item) => (
                                <tr key={item.name}
                                    className="border-b border-slate-50 dark:border-zinc-700/50 last:border-0">
                                    <td className="py-2 text-slate-700 dark:text-slate-300">{item.name}</td>
                                    <td className="py-2 font-semibold text-slate-900 dark:text-white">{item.score}</td>
                                    <td className="py-2">
                                        <div
                                            className="w-24 h-2 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{width: `${(item.score / 5) * 100}%`}}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2 text-slate-500 dark:text-slate-400">{item.previous}</td>
                                    <td className="py-2">
                                        {item.change > 0 ? (
                                            <span
                                                className="text-green-600 dark:text-green-400 font-medium">+{item.change} ↑</span>
                                        ) : item.change < 0 ? (
                                            <span
                                                className="text-red-600 dark:text-red-400 font-medium">{item.change} ↓</span>
                                        ) : (
                                            <span className="text-slate-400">0 —</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 總評分 + 加權公式 + 評審人評語 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className={`${cardClass} p-4 flex items-center gap-4`}>
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">總評分</div>
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">4.1</div>
                        </div>
                        <span
                            className="px-3 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-lg font-bold">A</span>
                    </div>
                    <div className={`${cardClass} p-4`}>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">加權公式</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                            質量×0.25 + 效率×0.20 + 協作×0.20 + 主動×0.15 + 溝通×0.15
                        </div>
                    </div>
                    <div className={`${cardClass} p-4`}>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">評審人評語</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                            技術能力突出，團隊協作良好，建議加強溝通表達。
                        </div>
                    </div>
                </div>

                {/* 審批流程 */}
                <div className={`${cardClass} p-4`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">審批流程</h3>
                    <div className="flex items-center justify-between">
                        {approvalSteps.map((step, index) => (
                            <div key={step.label} className="flex items-center flex-1">
                                {renderApprovalIcon(step)}
                                <div
                                    className="ml-2 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{step.label}</div>
                                {index < approvalSteps.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-2 ${step.status === 'completed' ? 'bg-green-500' : 'bg-slate-200 dark:bg-zinc-700'}`}/>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 操作欄 */}
                <div className={`${cardClass} p-4 flex items-center justify-between`}>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        操作（當前狀態：已完成 · 只讀）
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={defaultOnBack}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                            返回列表
                        </button>
                        <button
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            打印
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
