// 考勤記錄表格
import {cardClasses} from "../constants/themeClasses.tsx";
import {departmentOptions, statusOptions} from "../../views/Directory.tsx";
import {ToolbarTextField} from "./ToolbarTextField.tsx";
import {CommonButton} from "./CommonButton.tsx";

export type AttendanceStatus = 'Normal' | 'Late' | 'Absent' | 'EarlyLeave';

export interface AttendanceRecord {
    id: number;
    name: string;
    email: string;
    avatar: string;
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    status: AttendanceStatus;
    hours: string;
}

interface AttendanceRecordTableProps {
    data: AttendanceRecord[];
    onGenerateData?: () => void;
}

const statusBadgeClasses: Record<AttendanceStatus, string> = {
    Normal: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Absent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    EarlyLeave: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const statusLabelMap: Record<AttendanceStatus, string> = {
    Normal: "Normal",
    Late: "Late",
    Absent: "Absent",
    EarlyLeave: "Early Leave",
};

const avatarColors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-cyan-500"];

const tHeadClass = 'text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400';


export const AttendanceRecordTable = ({data, onGenerateData}: AttendanceRecordTableProps) => {


    return (
        <div className={` mt-6`}>
            {/* 工具欄 */}
            <div className={`${cardClasses} flex gap-4 my-6`}>
                <ToolbarTextField type="input" hintText="選擇日期..." prefixIcon="📅"/>
                <ToolbarTextField type="select" options={departmentOptions}/>
                <ToolbarTextField type="select" options={statusOptions}/>
                <div className="flex-1"/>
                {data.length === 0 && onGenerateData ? (
                    <CommonButton title={'生成測試數據'} bgColor="purple" onPressed={onGenerateData}/>
                ) : null}
                <CommonButton title={'⏰模擬打卡'} onPressed={() => {
                }}/>
            </div>

            {/* 表格 */}
            <div className={`${cardClasses} overflow-x-auto`}>

                {data.length > 0 ? <table className="w-full text-sm">
                    {/* 表頭 */}
                    <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className={tHeadClass}>員工</th>
                        <th className={tHeadClass}>日期</th>
                        <th className={tHeadClass}>上班打卡</th>
                        <th className={tHeadClass}>下班打卡</th>
                        <th className={tHeadClass}>狀態</th>
                        <th className={tHeadClass}>工時</th>
                    </tr>
                    </thead>
                    {/* 表格主題 */}
                    <tbody>
                    {data.map((record, index) => (
                        <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
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
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{record.date}</td>
                            <td className={`py-3 px-4 ${record.clockIn ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                                {record.clockIn ?? '—'}
                            </td>
                            <td className={`py-3 px-4 ${record.clockOut ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`}>
                                {record.clockOut ?? '—'}
                            </td>
                            <td className="py-3 px-4">
                                    <span
                                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusBadgeClasses[record.status]}`}>
                                        {statusLabelMap[record.status]}
                                    </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{record.hours}</td>
                        </tr>
                    ))}
                    </tbody>
                </table> : (<div className="flex flex-col items-center justify-center py-16">
                    <span className="text-6xl mb-4">👥</span>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
                        還沒有員工記錄
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        點擊「生成數據」開始進行測試吧!
                    </p>
                </div>)}


            </div>
        </div>
    );
};
