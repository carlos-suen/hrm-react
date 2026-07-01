import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export interface ChartData {
    name: string;
    value?: number;
    fill?: string;
    [key: string]: string | number | undefined;
}

interface ChartCardProps {
    data: ChartData[];
    type?: "pie" | "bar" | "line" | "area" | "horizontal-bar";
    className?: string;
    title?: string;
    valueFormatter?: (value: number) => string;
}

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'];

const areaConfig = {
    attendance: { dataKey: "attendance", stroke: "#3b82f6", fill: "#3b82f6", name: "出勤" },
    late: { dataKey: "late", stroke: "#f59e0b", fill: "#f59e0b", name: "遲到" },
};

export const ChartCard = ({ data, type = "bar", className, title, valueFormatter }: ChartCardProps) => {
    const cardClasses = `bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm dark:shadow-none border border-slate-200 
        dark:border-slate-700`;

    switch (type) {
        case "pie":
            return (
                <div className={`${cardClasses} ${className}`}>
                    {title && <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{title}</h3>}
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({name, percent}) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
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
        case "bar":
            return (
                <div className={`${cardClasses} ${className}`}>
                    {title && <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{title}</h3>}
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={valueFormatter} />
                            <Tooltip formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined} />
                            <Bar dataKey="value" name="工資" radius={[4, 4, 0, 0]} minPointSize={0}>
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.fill || COLORS[index % COLORS.length]} />
                                ))}
                                <LabelList dataKey="value" position="top" fontSize={12} fill="#64748b" formatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        case "horizontal-bar":
            return (
                <div className={`${cardClasses} ${className}`}>
                    {title && <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{title}</h3>}
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 12 }} hide />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} width={90} axisLine={false} tickLine={false} tickMargin={10} />
                            {/*<Tooltip />*/}
                            <Bar dataKey="value" name="績效分" radius={[0, 4, 4, 0]} barSize={20}>
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.fill || `rgba(59, 130, 246, ${1 - index * 0.15})`} />
                                ))}
                                <LabelList dataKey="value" position="right" fontSize={12} fill="#64748b" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        case "line":
            return (
                <div className={`${cardClasses} ${className}`}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" name="數值" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            );
        case "area":
            return (
                <div className={`${cardClasses} ${className}`}>
                    {title && <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{title}</h3>}
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey={areaConfig.attendance.dataKey}
                                stroke={areaConfig.attendance.stroke}
                                fill={areaConfig.attendance.fill}
                                fillOpacity={0.1}
                                name={areaConfig.attendance.name}
                            />
                            <Area
                                type="monotone"
                                dataKey={areaConfig.late.dataKey}
                                stroke={areaConfig.late.stroke}
                                fill={areaConfig.late.fill}
                                fillOpacity={0.1}
                                name={areaConfig.late.name}
                            />
                        </AreaChart>
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