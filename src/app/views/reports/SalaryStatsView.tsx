import {ToolbarTextField} from "../../common/components/ToolbarTextField.tsx";
import {cardClasses} from "../../common/constants/themeClasses.tsx";
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface DeptSalaryData {
    name: string;
    average: number;
    median: number;
}

const deptSalaryData: DeptSalaryData[] = [
    {name: "Engineering", average: 22000, median: 20500},
    {name: "Marketing", average: 17500, median: 16000},
    {name: "Sales", average: 18500, median: 17000},
    {name: "HR", average: 16000, median: 15000},
    {name: "Finance", average: 15000, median: 14500},
];

interface SalaryRangeData {
    name: string;
    value: number;
}

const salaryRangeData: SalaryRangeData[] = [
    {name: "<10K", value: 2},
    {name: "10-15K", value: 10},
    {name: "15-20K", value: 20},
    {name: "20-25K", value: 10},
    {name: "25-30K", value: 4},
];

const rangeColors = ["#dbeafe", "#bfdbfe", "#93c5fd", "#bfdbfe", "#dbeafe"];

export const SalaryStatsView = () => {
    return (
        <section>
            {/* 標題 */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">薪資分析報表</h2>

            {/* 工具欄 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <ToolbarTextField prefixIcon="📅 開始:" type="select"/>
                <ToolbarTextField prefixIcon="📅 結束:" type="select"/>
                <ToolbarTextField prefixIcon=" 部門:" type="select"/>
                <button className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
                     導出 CSV
                </button>
            </div>

            {/* 匯總卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">全公司平均薪資</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">¥18,500</div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-5">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">全公司中位數</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">¥17,200</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-5">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">薪資總成本</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">¥888,000<span className="text-sm font-normal text-slate-400 ml-1">/月</span></div>
                </div>
            </div>

            {/* 圖表區域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 部門薪資對比 */}
                <div className={`${cardClasses} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">部門薪資對比</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-blue-500 rounded-sm"/>
                                平均
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-green-500 rounded-sm"/>
                                中位數
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={deptSalaryData} layout="vertical" margin={{left: 10, right: 60}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false}/>
                            <XAxis type="number" tick={{fontSize: 12}} hide/>
                            <YAxis type="category" dataKey="name" tick={{fontSize: 13}} width={90} axisLine={false} tickLine={false} tickMargin={10}/>
                            <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`}/>
                            <Bar dataKey="average" name="平均" radius={[0, 4, 4, 0]} barSize={12} fill="#3b82f6">
                                {deptSalaryData.map((entry, index) => (
                                    <Cell key={`avg-${index}`}/>
                                ))}
                            </Bar>
                            <Bar dataKey="median" name="中位數" radius={[0, 4, 4, 0]} barSize={12} fill="#22c55e">
                                {deptSalaryData.map((entry, index) => (
                                    <Cell key={`med-${index}`}/>
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 薪資分佈 */}
                <div className={`${cardClasses} p-6`}>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">薪資分佈</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salaryRangeData} margin={{top: 10}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                            <XAxis dataKey="name" tick={{fontSize: 12}}/>
                            <YAxis tick={{fontSize: 12}}/>
                            <Tooltip/>
                            <Bar dataKey="value" name="人數" radius={[6, 6, 0, 0]} barSize={48}>
                                {salaryRangeData.map((entry, index) => (
                                    <Cell key={index} fill={rangeColors[index % rangeColors.length]}/>
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};
