import { ReportDataCard } from "./components/ReportDataCard.tsx";
import { ToolbarTextField } from "../../common/components/ToolbarTextField.tsx";
import { ChartCard, type ChartData } from "../../common/components/ChartCard.tsx";
import { cardClasses } from "../../common/constants/themeClasses.tsx";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const headcountTrendData: ChartData[] = [
    { name: "1月", total: 42, newHire: 40 },
    { name: "2月", total: 43, newHire: 41 },
    { name: "3月", total: 45, newHire: 42 },
    { name: "4月", total: 47, newHire: 42 },
    { name: "5月", total: 48, newHire: 43 },
    { name: "6月", total: 50, newHire: 44 },
];

const deptDistributionData: ChartData[] = [
    { name: "Engineering", value: 35, fill: "#3b82f6" },
    { name: "Marketing", value: 20, fill: "#22c55e" },
    { name: "Sales", value: 15, fill: "#f97316" },
    { name: "HR", value: 15, fill: "#a855f7" },
    { name: "Finance", value: 15, fill: "#ec4899" },
];

const routeMap: Record<string, string> = {
    headcount: "/reports/employee-stats",
    turnover: "/reports/resign-stats",
    salary: "/reports/salary-stats",
    attendance: "/reports/attendance-stats",
    performance: "/reports/performance-stats",
};

export const Reports = () => {
    const reportItems = [
        { id: "headcount", label: "人數統計", desc: "員工人數趨勢、部門分佈", icon: "", color: "bg-blue-100" },
        { id: "turnover", label: "離職率分析", desc: "離職率趨勢、原因分析", icon: "📉", color: "bg-pink-100" },
        { id: "salary", label: "薪資分析", desc: "薪資分佈、部門對比", icon: "💰", color: "bg-green-100" },
        { id: "attendance", label: "考勤統計", desc: "出勤率、遲到率趨勢", icon: "", color: "bg-yellow-100" },
        { id: "performance", label: "績效分析", desc: "等級分佈、部門對比", icon: "🏆", color: "bg-purple-100" },
    ];

    const handleViewReport = (id: string) => {
        const route = routeMap[id];
        if (route) window.location.href = route;
    };

    return (
        <section>
            {/* 數據卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportItems.map(item => (
                    <ReportDataCard key={item.id} {...item} onViewReport={() => handleViewReport(item.id)} />
                ))}
            </div>

        </section>
    );
}
