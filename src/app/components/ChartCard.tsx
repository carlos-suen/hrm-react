import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export interface ChartData {
    name: string;
    value: number;
}

interface ChartCardProps {
    data: ChartData[];
    type?: "pie" | "line";
    className?: string;
}

// t
const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'];




export const ChartCard = ({ data, type = "line", className }: ChartCardProps) => {
    const cardClasses = `bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm dark:shadow-none border border-slate-200 
        dark:border-slate-700`;


    switch (type) {
        case "pie":
            return (
                <div className={`${cardClasses} ${className}`}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {data?.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            );
        case "line":
            return (
                <div className={`${cardClasses} ${className}`}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" name="平均薪資" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        default:
            return (
                <div className={`${cardClasses} ${className}`}>
                    <p className="text-center text-slate-500">未知圖表類型</p>
                </div>
            );
    }


}