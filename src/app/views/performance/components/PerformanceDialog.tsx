import {useEffect, useState} from "react";

interface DimensionScore {
    label: string;
    value: number;
}

interface PerformanceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PerformanceFormData) => void;
}

interface PerformanceFormData {
    name: string;
    duration: string;
    score: number;
    level: string;
    status: number;
    monitor: string;
}

const defaultScores: DimensionScore[] = [
    {label: '工作質量', value: 4.0},
    {label: '工作效率', value: 3.5},
    {label: '團隊協作', value: 4.5},
    {label: '主動性', value: 4.0},
    {label: '溝通能力', value: 3.0},
];

export const PerformanceDialog = ({isOpen, onClose, onSubmit}: PerformanceDialogProps) => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('2026 Q1');
    const [monitor, setMonitor] = useState('');
    const [scores, setScores] = useState<Record<string, number>>(() =>
        Object.fromEntries(defaultScores.map(d => [d.label, d.value]))
    );
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleScoreChange = (label: string, value: number) => {
        setScores(prev => ({...prev, [label]: value}));
    };

    const calcScore = () => {
        const values = Object.values(scores);
        return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const calcLevel = (avg: number) => {
        const floor = Math.floor(avg);
        if (floor === 5) return 'S';
        if (floor === 4) return 'A';
        if (floor === 3) return 'B';
        if (floor === 2) return 'C';
        return 'D';
    };

    const handleSubmit = () => {
        const score = calcScore();
        onSubmit({
            name,
            duration,
            score,
            level: calcLevel(score),
            status: 0,
            monitor,
        });
        onClose();
    };

    const handleClose = () => {
        setName('');
        setDuration('2026 Q1');
        setMonitor('');
        setScores(Object.fromEntries(defaultScores.map(d => [d.label, d.value])));
        setComment('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative z-10 w-full max-w-xl mx-4 bg-slate-100 dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">新增績效評估</h3>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* 員工選擇 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            員工姓名 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="輸入員工姓名..."
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* 評估週期 + 監管人 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                評估週期 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                監管人 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={monitor}
                                onChange={e => setMonitor(e.target.value)}
                                placeholder="輸入監管人..."
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* 五維評分 */}
                    <div className="border-t border-slate-200 dark:border-zinc-700 pt-5">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">五維評分</h4>
                        <div className="space-y-4">
                            {defaultScores.map((dim) => (
                                <div key={dim.label} className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {dim.label}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="0.5"
                                        value={scores[dim.label]}
                                        onChange={(e) => handleScoreChange(dim.label, Number(e.target.value))}
                                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <span className="w-10 text-center font-mono text-lg font-bold text-blue-600">
                                        {scores[dim.label].toFixed(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 評語 */}
                    <div className="border-t border-slate-200 dark:border-zinc-700 pt-5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            評語
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="輸入評語..."
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-white dark:bg-zinc-800 border-t border-slate-200 dark:border-zinc-700">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-zinc-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        提交評估
                    </button>
                </div>
            </div>
        </div>
    );
};
