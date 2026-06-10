import {ToolbarTextField} from "../../common/components/ToolbarTextField.tsx";
import {ChartCard, type ChartData} from "../../common/components/ChartCard.tsx";
import {cardClasses} from "../../common/constants/themeClasses.tsx";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";

const headcountTrendData: ChartData[] = [
    {name: "1月", total: 42, newHire: 40},
    {name: "2月", total: 43, newHire: 41},
    {name: "3月", total: 45, newHire: 42},
    {name: "4月", total: 47, newHire: 42},
    {name: "5月", total: 48, newHire: 43},
    {name: "6月", total: 50, newHire: 44},
];

const deptDistributionData: ChartData[] = [
    {name: "Engineering", value: 35, fill: "#3b82f6"},
    {name: "Marketing", value: 20, fill: "#22c55e"},
    {name: "Sales", value: 15, fill: "#f97316"},
    {name: "HR", value: 15, fill: "#a855f7"},
    {name: "Finance", value: 15, fill: "#ec4899"},
];

interface MonthlyDetail {
    month: string;
    total: number;
    newHire: number;
    resigned: number;
    netGrowth: number;
    attendanceRate: string;
    trend: "up" | "down" | "flat";
}

const monthlyDetails: MonthlyDetail[] = [
    {month: "2026-01", total: 48, newHire: 3, resigned: 1, netGrowth: 2, attendanceRate: "96.2%", trend: "up"},
    {month: "2026-02", total: 50, newHire: 4, resigned: 2, netGrowth: 2, attendanceRate: "95.8%", trend: "up"},
    {month: "2026-03", total: 52, newHire: 3, resigned: 1, netGrowth: 2, attendanceRate: "97.1%", trend: "up"},
    {month: "2026-04", total: 53, newHire: 2, resigned: 1, netGrowth: 1, attendanceRate: "96.5%", trend: "flat"},
    {month: "2026-05", total: 55, newHire: 4, resigned: 2, netGrowth: 2, attendanceRate: "95.3%", trend: "up"},
];

const trendIconMap: Record<MonthlyDetail["trend"], string> = {
    up: "↑",
    down: "↓",
    flat: "→",
};

const trendColorMap: Record<MonthlyDetail["trend"], string> = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    flat: "text-slate-400",
};

export const EmployeeStatsView = () => {
    return (
        <section className={`align-middle`}>
            {/* 標題 */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">人數統計報表</h2>

            {/* 工具欄 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <ToolbarTextField prefixIcon="📅 開始:" type="select"/>
                <ToolbarTextField prefixIcon="📅 結束:" type="select"/>
                <ToolbarTextField prefixIcon="🏢 部門:" type="select"/>
                <button className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
                     導出 CSV
                </button>
            </div>

            {/* 圖表區域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 人數趨勢 */}
                <div className={`${cardClasses} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">人數趨勢</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-0.5 bg-blue-500 rounded"/>
                                總人數
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-0.5 bg-green-500 rounded"/>
                                新入職
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={headcountTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                            <XAxis dataKey="name" tick={{fontSize: 12}}/>
                            <YAxis tick={{fontSize: 12}} domain={[40, 55]}/>
                            <Tooltip/>
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.1}
                                name="總人數"
                            />
                            <Area
                                type="monotone"
                                dataKey="newHire"
                                stroke="#22c55e"
                                fill="#22c55e"
                                fillOpacity={0.1}
                                name="新入職"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* 部門分佈 */}
                <ChartCard data={deptDistributionData} type="pie" title="部門分佈"/>
            </div>

            {/* 月度明細 */}
            <div className={`${cardClasses} overflow-x-auto`}>
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">月份</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">總人數</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">新入職</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">離職</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">淨增長</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">出勤率</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">趨勢</th>
                    </tr>
                    </thead>
                    <tbody>
                    {monthlyDetails.map((row) => (
                        <tr key={row.month} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.month}</td>
                            <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{row.total}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.newHire}</td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.resigned}</td>
                            <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">+{row.netGrowth}</td>
                            <td className="py-3 px-4 text-slate-900 dark:text-white">{row.attendanceRate}</td>
                            <td className={`py-3 px-4 font-medium ${trendColorMap[row.trend]}`}>
                                {trendIconMap[row.trend]}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
