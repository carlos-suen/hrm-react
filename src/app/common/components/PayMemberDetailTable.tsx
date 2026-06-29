import {cardClasses} from "../constants/themeClasses.tsx";

export type PayStatus = 'Draft' | 'Confirmed' | 'Paid';

export interface PayRecord {
    id: number;
    name: string;
    email: string;
    avatar: string;
    department: string;
    baseSalary: string;
    bonus: string;
    deduction: string;
    netPay: string;
    status: PayStatus;
}

interface PayDetailTableProps {
    data: PayRecord[];
    selectedIds: number[];
    onToggleSelect: (id: number) => void;
    onToggleSelectAll: () => void;
    onConfirm: (id: number) => void;
    onPay: (id: number) => void;
}

const statusBadgeClasses: Record<PayStatus, string> = {
    Draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    Confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Paid: "bg-red-100 text-red-700 dark:bg-green-900/30 dark:text-green-400",
};

const avatarColors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-cyan-500"];

export const tHeadClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400';


export const PayDetailTable = ({data, selectedIds, onToggleSelect, onToggleSelectAll, onConfirm, onPay}: PayDetailTableProps) => {
    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

    return (
        <div className={`${cardClasses} overflow-x-auto`}>
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 w-10">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => {
                                if (el) el.indeterminate = someSelected;
                            }}
                            onChange={onToggleSelectAll}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </th>
                    <th className={`${tHeadClass}`}>員工</th>
                    <th className={`${tHeadClass}`}>部門</th>
                    <th className={`${tHeadClass}`}>基本工資</th>
                    <th className={`${tHeadClass}`}>獎金</th>
                    <th className={`${tHeadClass}`}>扣款</th>
                    <th className={`${tHeadClass}`}>實發</th>
                    <th className={`${tHeadClass}`}>狀態</th>
                    <th className={`${tHeadClass}`}>操作</th>
                </tr>
                </thead>
                <tbody>
                {data.map((record, index) => (
                    <tr key={record.id}
                        className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${selectedIds.includes(record.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                        <td className="py-3 px-4">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(record.id)}
                                onChange={() => onToggleSelect(record.id)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        </td>
                        <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-xs font-medium`}>
                                    {record.avatar}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-white">{record.name}</div>
                                    <div className="text-xs text-slate-400">{record.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{record.department}</td>
                        <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{record.baseSalary}</td>
                        <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">{record.bonus}</td>
                        <td className="py-3 px-4 text-red-600 dark:text-red-400 font-medium">{record.deduction}</td>
                        <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">{record.netPay}</td>
                        <td className="py-3 px-4">
                                <span
                                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusBadgeClasses[record.status]}`}>
                                    {record.status}
                                </span>
                        </td>
                        <td className="py-3 px-4">
                            {record.status === 'Draft' ? (
                                <button
                                    onClick={() => onConfirm(record.id)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                                    確認
                                </button>
                            ) : record.status === 'Confirmed' ? (
                                <button
                                    onClick={() => onPay(record.id)}
                                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium">
                                    發放
                                </button>
                            ) : (
                                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed">
                                    已發放
                                </span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
