import type {EmployeePerformanceData} from "../../common/models/EmployeePerformanceData.ts";
import {tHeadClass} from "../../common/components/PayMemberDetailTable.tsx";
import {ColoredAvatar} from "./components/ColoredAvatar.tsx";


interface PerformanceTableProps {
    heads: string[];
    data: EmployeePerformanceData[];
    className?: string;
}


const statusBadgeClasses: Record<number, string> = {
    0: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    2: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const statusLabels: Record<number, string> = {
    0: "Self Review",
    1: "Manager Review",
    2: "Completed",
};

const levelBadgeClasses: Record<string, string> = {
    S: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    A: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    B: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    C: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    D: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const PerformanceTable = ({heads, data, className}: PerformanceTableProps) => {

    return (
        <table className={`w-full text-sm ${className ?? ''}`}>
            {/* 表頭 */}
            <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
                {heads.map((head, index) => (
                    <th key={index} className={`${tHeadClass}`}>
                        {head}
                    </th>
                ))}
            </tr>
            </thead>

            {/* 內容 */}
            <tbody>
            {data.map((record) => (
                <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                            <ColoredAvatar level={record.level} firstName={record.name[0]}/>
                            <div className="font-medium text-slate-900 dark:text-white">{record.name}</div>
                        </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{record.duration}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{record.score}</td>
                    <td className="py-3 px-4">
                        <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${levelBadgeClasses[record.level] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {record.level}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                        <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusBadgeClasses[record.status] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {statusLabels[record.status] ?? record.status}
                        </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{record.monitor}</td>
                    <td className="py-3 px-4">
                        <button
                            onClick={() => window.location.href = `/performance-detail?id=${record.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                            詳情
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );

}
