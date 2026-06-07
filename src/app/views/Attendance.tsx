import {DataCard, type DataCardItem} from "../components/DataCard.tsx";
import {ChartCard} from "../components/ChartCard.tsx";
import {AttendanceCalendar} from "../components/AttendanceCalendar.tsx";
import {AttendanceRecordTable, type AttendanceRecord} from "../components/AttendanceRecordTable.tsx";


const attendanceItems: DataCardItem[] = [
    {id: "total-employees", label: "本月薪資總覽", icon: "💰", value: "42", desc: "較上月 +3"},
    {id: "employment-rate", label: "平均薪資", icon: "📈", value: "85.7%", desc: "較上月 +2%"},
    {id: "salary-expense", label: "最高薪資", icon: "⬆️", value: "¥528,000", desc: "較上月 +8%"},
    {id: "pending-approvals", label: "待確認薪資", icon: "", value: "4", desc: "待處理"},
];

const attendanceTrendData = [
    {name: "5/28", attendance: 28, late: 4},
    {name: "5/29", attendance: 30, late: 6},
    {name: "5/30", attendance: 26, late: 3},
    {name: "5/31", attendance: 32, late: 7},
    {name: "6/1", attendance: 30, late: 5},
    {name: "6/2", attendance: 34, late: 8},
    {name: "6/3", attendance: 32, late: 6},
];

const calendarData = [
    {title: "1", type: "Normal" as const},
    {title: "2", type: "Normal" as const},
    {title: "3", type: "Late" as const},
    {title: "4", type: "Normal" as const},
    {title: "5", type: "Absent" as const},
    {title: "6", type: "Weekend" as const},
    {title: "7", type: "Weekend" as const},
    {title: "8", type: "Normal" as const},
    {title: "9", type: "OLeave" as const},
    {title: "10", type: "Normal" as const},
    {title: "11", type: "Normal" as const},
    {title: "12", type: "Late" as const},
    {title: "13", type: "Weekend" as const},
    {title: "14", type: "Weekend" as const},
    {title: "15", type: "Normal" as const},
    {title: "16", type: "Normal" as const},
    {title: "17", type: "Normal" as const},
    {title: "18", type: "Future" as const},
    {title: "19", type: "Future" as const},
    {title: "20", type: "Future" as const},
];

const recordTableData: AttendanceRecord[] = [
    {id: 1, name: "張偉", email: "zhangwei@co.com", avatar: "張", date: "2026-06-03", clockIn: "08:15", clockOut: "18:30", status: "Normal", hours: "9.5h"},
    {id: 2, name: "李娜", email: "lina@co.com", avatar: "李", date: "2026-06-03", clockIn: "09:45", clockOut: "18:20", status: "Late", hours: "7.8h"},
    {id: 3, name: "王強", email: "wangqiang@co.com", avatar: "王", date: "2026-06-03", clockIn: null, clockOut: null, status: "Absent", hours: "0h"},
    {id: 4, name: "趙敏", email: "zhaomin@co.com", avatar: "趙", date: "2026-06-03", clockIn: "08:05", clockOut: "16:30", status: "EarlyLeave", hours: "7.2h"},
    {id: 5, name: "陳思", email: "chensi@co.com", avatar: "陳", date: "2026-06-03", clockIn: "08:20", clockOut: "18:00", status: "Normal", hours: "8.5h"},
];

/// 頁面
export const Attendance = () => {


    return (
        <section className={``}>
            {/* 卡片總覽 */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
                {attendanceItems.map(item => (
                    <DataCard key={item.id} data={item}/>
                ))}
            </div>

            {/* 考勤趨勢 */}
            <div className="my-6">
                <ChartCard
                    data={attendanceTrendData}
                    type="area"
                    title="考勤趨勢（近7天）"
                />
            </div>


            {/* 考勤日曆 */}
            <AttendanceCalendar headerTitle={'考勤日曆'} data={calendarData}/>

            {/* 考勤記錄表 */}
            <AttendanceRecordTable data={recordTableData}/>

        </section>
    );
}