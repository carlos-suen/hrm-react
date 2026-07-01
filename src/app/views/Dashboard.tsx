import {DataCard} from "../common/components/DataCard.tsx";
import type {DataCardItem} from "../common/components/DataCard.tsx";
import {ChartCard, type ChartData} from "../common/components/ChartCard.tsx";
import {useState, useEffect, type ReactNode} from "react";
import {dashboardApi} from "../../server/lib/api.ts";

const dataItems: DataCardItem[] = [
    {id: "total-employees", label: "總員工數", icon: "👥", value: "42", desc: "較上月 +3"},
    {id: "employment-rate", label: "在職率", icon: "✅", value: "85.7%", desc: "較上月 +2%"},
    {id: "salary-expense", label: "薪資支出", icon: "💰", value: "¥528,000", desc: "較上月 +8%"},
    {id: "pending-approvals", label: "待審批", icon: "⏰", value: "4", desc: "待處理"},
];

const formatCurrency = (value: number) => `¥${value.toLocaleString('zh-CN')}`;

const ChartPlaceholder = ({children, isError = false}: { children: string; isError?: boolean }) => (
    <div className={`bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700
        flex items-center justify-center h-[388px] ${isError ? 'text-red-500' : 'text-slate-400 animate-pulse'}`}>
        {children}
    </div>
);

export const Dashboard = () => {
    const [pieChartData, setPieChartData] = useState<ChartData[]>([]);
    const [barChartData, setBarChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [deptStats, salaryStats] = await Promise.all([
                    dashboardApi.getDepartmentStats(),
                    dashboardApi.getSalaryStats(),
                ]);
                if (cancelled) return;
                setPieChartData(deptStats);
                setBarChartData(salaryStats);
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : '數據載入失敗');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const renderChartSlot = (chart: ReactNode) => {
        if (loading) return <ChartPlaceholder>載入中...</ChartPlaceholder>;
        if (error) return <ChartPlaceholder isError={true}>{error}</ChartPlaceholder>;
        return chart;
    };

    return (
        <section>
            {/*數據卡片區域*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dataItems.map(item => (
                    <DataCard key={item.id} data={item}/>
                ))}
            </div>

            {/* 圖表區域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {renderChartSlot(<ChartCard type="pie" data={pieChartData} title="部門人數分佈"/>)}
                {renderChartSlot(
                    <ChartCard data={barChartData} title="部門平均薪資" valueFormatter={formatCurrency}/>
                )}
            </div>
        </section>
    );
};
