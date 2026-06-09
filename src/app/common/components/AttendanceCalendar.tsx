import {cardClasses} from "../constants/themeClasses.tsx";

export type CalendarItemType = 'Normal' | 'Late' | "ELeave" | 'Absent' | 'OLeave' | 'Future' | 'Weekend';


export interface CalendarAreaData {
    tagColor: string;
    title: string;
}

export interface CalenderItemData {
    title: string;
    type: CalendarItemType;
}

interface AttendanceCalendarProps {
    headerTitle: string;
    data: CalenderItemData[];
    // 日曆下方下方標籤
    areas?: CalendarAreaData[];
}

const weekdayHeaders = ['日', '一', '二', '三', '四', '五', '六'];

const bgColorClasses: Record<CalendarItemType, string> = {
    Normal: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    ELeave: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    Absent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    OLeave: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Future: "bg-slate-50 text-slate-400 dark:bg-slate-900/30 dark:text-slate-400",
    Weekend: "bg-slate-100 text-slate-400 dark:bg-slate-900/30 dark:text-slate-400",
};

const legendItems: {type: CalendarItemType; label: string}[] = [
    {type: 'Normal', label: '正常'},
    {type: 'Late', label: '遲到'},
    {type: 'Absent', label: '缺勤'},
    {type: 'OLeave', label: '請假'},
    {type: 'Future', label: '未來'},
];

/// 日曆組件
const CalendarItem = ({item}: {item: CalenderItemData}) => {
    return (
        <div className={`${bgColorClasses[item.type]} rounded-lg p-2 text-center text-sm font-medium min-h-[40px] flex items-center justify-center`}>
            {item.title}
        </div>
    );
}


export const AttendanceCalendar = ({headerTitle, data}: AttendanceCalendarProps) => {
    const emptyCells = Array.from({length: 1}, (_, i) => i);

    return (
        <div className={`${cardClasses}`}>

            {/* 標題 */}
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">{headerTitle}</h3>

            {/* 日曆內容 */}
            <div className={`grid grid-cols-7 gap-2`}>
                {/* 星期標題 */}
                {weekdayHeaders.map(day => (
                    <div key={day} className="text-center text-sm text-slate-400 dark:text-slate-500 font-medium py-1">
                        {day}
                    </div>
                ))}

                {/* 空白单元格（月份第一天之前的位置） */}
                {emptyCells.map((_, index) => (
                    <div key={`empty-${index}`} className="min-h-[40px]"/>
                ))}

                {/* 日期单元格 */}
                {data.map((item, index) => (
                    <CalendarItem key={index} item={item}/>
                ))}
            </div>

            {/* 標籤區域 */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 dark:border-slate-700">
                {legendItems.map(legend => (
                    <div key={legend.type} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${bgColorClasses[legend.type].split(' ')[0]}`}/>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{legend.label}</span>
                    </div>
                ))}
            </div>


        </div>

    );
}