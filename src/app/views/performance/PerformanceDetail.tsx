import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { performanceApi } from "../../../server/lib/api.ts";
import { useEffect, useState } from "react";

interface DimensionScore {
    dimension: string;
    current: number;
    previous: number;
}

interface ApprovalStep {
    label: string;
    status: 'completed' | 'current' | 'pending';
}

interface PerformanceRecord {
    id: number;
    name: string;
    duration: string;
    score: number;
    level: string;
    status: number;
    monitor: string;
    scores?: Record<string, number>;
    created_at: string;
    updated_at: string;
}

const dimensionLabels = ['質量', '效率', '協作', '主動', '溝通'];

const cardClass = 'bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700';

const renderApprovalIcon = (step: ApprovalStep) => {
    if (step.status === 'completed') {
        return (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        );
    }
    if (step.status === 'current') {
        return (
            <div className="w-8 h-8 rounded-full bg-blue-500 animate-pulse flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-full" />
            </div>
        );
    }
    return (
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 bg-slate-400 dark:bg-zinc-500 rounded-full" />
        </div>
    );
};

const getApprovalSteps = (status: number): ApprovalStep[] => {
    const steps: ApprovalStep[] = [
        { label: '自評', status: 'completed' },
        { label: '主管審核', status: status >= 1 ? 'completed' : 'current' },
        { label: 'HR審核', status: status >= 2 ? 'completed' : status === 1 ? 'current' : 'pending' },
        { label: '完成', status: status >= 2 ? 'completed' : 'pending' },
    ];
    return steps;
};

const statusLabels: Record<number, string> = {
    0: '自評中',
    1: '主管審核中',
    2: '已完成',
};

export const PerformanceDetail = () => {
    const [record, setRecord] = useState<PerformanceRecord | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (!id) {
            setLoading(false);
            return;
        }

        performanceApi.getById(Number(id))
            .then(data => {
                setRecord(data);
            })
            .catch(e => {
                console.error('Failed to fetch performance detail:', e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const defaultOnBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-slate-400">載入中...</div>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-slate-400">找不到該績效記錄</div>
            </div>
        );
    }

    const scores = record.scores || {};
    const radarData: DimensionScore[] = dimensionLabels.map(dim => ({
        dimension: dim,
        current: scores[dim] || 0,
        previous: (scores[dim] || 0) - 0.3,
    }));

    const scoreDetails = dimensionLabels.map(dim => {
        const current = scores[dim] || 0;
        const previous = (scores[dim] || 0) - 0.3;
        return {
            name: dim,
            score: current,
            previous,
            change: current - previous,
        };
    });

    const approvalSteps = getApprovalSteps(record.status);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto w-full space-y-4 pb-8">
                {/* 頂部標題 */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">績效詳情 — {record.name}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {record.duration} | 監管人: {record.monitor}
                        </p>
                    </div>
                </div>

                {/* 員工資訊卡片 */}
                <div className={`${cardClass} p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {record.name[0]}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{record.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{record.monitor}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-500 dark:text-slate-400">評估週期</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{record.duration}</div>
                    </div>
                </div>

                {/* 雷達圖 + 評分明細 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 雷達圖 */}
                    <div className={`${cardClass} p-4`}>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">五維能力雷達圖</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="currentColor" className="text-slate-200 dark:text-zinc-700" />
                                <PolarAngleAxis dataKey="dimension" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-slate-600 dark:text-slate-400" />
                                <Radar name="本期" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                <Radar name="上期" dataKey="previous" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} strokeDasharray="5 5" />
                                <Legend />
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
                                    <tr key={item.name} className="border-b border-slate-50 dark:border-zinc-700/50 last:border-0">
                                        <td className="py-2 text-slate-700 dark:text-slate-300">{item.name}</td>
                                        <td className="py-2 font-semibold text-slate-900 dark:text-white">{item.score}</td>
                                        <td className="py-2">
                                            <div className="w-24 h-2 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.score / 5) * 100}%` }} />
                                            </div>
                                        </td>
                                        <td className="py-2 text-slate-500 dark:text-slate-400">{item.previous.toFixed(1)}</td>
                                        <td className="py-2">
                                            {item.change > 0 ? (
                                                <span className="text-green-600 dark:text-green-400 font-medium">+{item.change.toFixed(1)} ↑</span>
                                            ) : item.change < 0 ? (
                                                <span className="text-red-600 dark:text-red-400 font-medium">{item.change.toFixed(1)} ↓</span>
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
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{record.score.toFixed(1)}</div>
                        </div>
                        <span className={`px-3 py-1 rounded text-lg font-bold ${
                            record.level === 'S' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                            record.level === 'A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            record.level === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            record.level === 'C' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>{record.level}</span>
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
                                <div className="ml-2 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{step.label}</div>
                                {index < approvalSteps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${step.status === 'completed' ? 'bg-green-500' : 'bg-slate-200 dark:bg-zinc-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 操作欄 */}
                <div className={`${cardClass} p-4 flex items-center justify-between`}>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        操作（當前狀態：{statusLabels[record.status] ?? '未知'} · 只讀）
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={defaultOnBack}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                            返回列表
                        </button>
                        <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            打印
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
