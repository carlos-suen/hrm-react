import {DataCard, type DataCardItem} from "../../common/components/DataCard.tsx";
import {ChartCard, type ChartData} from "../../common/components/ChartCard.tsx";
import {ToolbarTextField} from "../../common/components/ToolbarTextField.tsx";
import {CommonButton} from "../../common/components/CommonButton.tsx";
import {cardClasses} from "../../common/constants/themeClasses.tsx";
import {PerformanceTable} from "./PerformanceTable.tsx";
import type {EmployeePerformanceData} from "../../common/models/EmployeePerformanceData.ts";
import {PerformanceDialog} from "./components/PerformanceDialog.tsx";
import {useState} from "react";


const dataItems: DataCardItem[] = [
    {id: "evaluation-count", label: "本期評估人數", icon: "📉", value: "8", desc: "已完成 5"},
    {id: "avg-score", label: "平均績效分", icon: "📝", value: "3.7", desc: "/ 5.0"},
    {id: "sa-ratio", label: "S/A 級佔比", icon: "🏆", value: "50%", desc: "4/8 人"},
    {id: "pending-review", label: "待審核數", icon: "", value: "3", desc: "待處理"},
];

const gradeDistributionData: ChartData[] = [
    {name: "S", value: 1, fill: "#a855f7"},
    {name: "A", value: 3, fill: "#3b82f6"},
    {name: "B", value: 3, fill: "#22c55e"},
    {name: "C", value: 1, fill: "#f97316"},
    {name: "D", value: 0, fill: "#ef4444"},
];

const deptPerformanceData: ChartData[] = [
    {name: "Engineering", value: 4.2},
    {name: "HR", value: 4.1},
    {name: "Marketing", value: 3.3},
    {name: "Finance", value: 3.3},
    {name: "Sales", value: 3.0},
];

const tableHeads = ["員工", "週期", "總分", "評級", "狀態", "監管人", '操作'];

const mockPerformanceData: EmployeePerformanceData[] = [
    {id: 1, name: "王小明", duration: "2024 Q4", score: 92, level: "A", status: 2, monitor: "張經理"},
    {id: 2, name: "李美玲", duration: "2024 Q4", score: 88, level: "A", status: 1, monitor: "陳總監"},
    {id: 3, name: "陳志豪", duration: "2024 Q4", score: 75, level: "B", status: 2, monitor: "張經理"},
    {id: 4, name: "林雅琪", duration: "2024 Q4", score: 68, level: "C", status: 0, monitor: "王主管"},
    {id: 5, name: "張偉翔", duration: "2024 Q4", score: 95, level: "S", status: 2, monitor: "陳總監"},
    {id: 6, name: "黃詩涵", duration: "2024 Q4", score: 82, level: "B", status: 1, monitor: "張經理"},
    {id: 7, name: "吳承恩", duration: "2024 Q4", score: 55, level: "D", status: 0, monitor: "王主管"},
    {id: 8, name: "劉家豪", duration: "2024 Q4", score: 85, level: "B", status: 2, monitor: "陳總監"},
];


export const Performance = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogSubmit = () => {
        setIsDialogOpen(false);
    };

    return (
        <section>
            {/* 卡片 */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6`}>
                {dataItems.map(item => (<DataCard data={item} key={item.id} {...item} />))}

            </div>

            {/* 圖表區域 */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 my-6`}>
                <ChartCard data={gradeDistributionData} type="bar" title="等級分佈" className={`flex-1`}/>
                <ChartCard data={deptPerformanceData} type="horizontal-bar" title="部門績效對比" className={`flex-1`}/>
            </div>

            {/* 工具欄 */
            }
            <div className={`flex flex-row justify-between mb-6`}>
                {/* 工具欄 */}
                <div className={`flex gap-4`}>
                    <ToolbarTextField prefixIcon={'📅 週期'} type={'select'}/>
                    <ToolbarTextField prefixIcon={'🏢 部門'} type={'select'}/>
                    <ToolbarTextField prefixIcon={'🌟 等級'} type={'select'}/>
                    <ToolbarTextField prefixIcon={'🌄 狀態'} type={'select'}/>
                </div>
                <CommonButton title={`+ 新增評估`} onPressed={() => setIsDialogOpen(true)}/>
            </div>

            {/* 表格 */
            }
            <div className={`${cardClasses} overflow-x-auto`}>
                <PerformanceTable heads={tableHeads} data={mockPerformanceData}/>
            </div>

            <PerformanceDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />

        </section>
    )
        ;
}