import {DataCard, type DataCardItem} from "../../common/components/DataCard.tsx";
import {ChartCard, type ChartData} from "../../common/components/ChartCard.tsx";
import {ToolbarTextField} from "../../common/components/ToolbarTextField.tsx";
import {CommonButton} from "../../common/components/CommonButton.tsx";
import {cardClasses} from "../../common/constants/themeClasses.tsx";
import {PerformanceTable} from "./PerformanceTable.tsx";
import type {EmployeePerformanceData} from "../../common/models/EmployeePerformanceData.ts";
import {PerformanceDialog} from "./components/PerformanceDialog.tsx";
import {performanceApi} from "../../../server/lib/api.ts";
import {useEffect, useState} from "react";


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

const mockTestData: Omit<EmployeePerformanceData, 'id'>[] = [
    {name: "王小明", duration: "2026 Q1", score: 4, level: "A", status: 2, monitor: "陳總監"},
    {name: "李小華", duration: "2026 Q1", score: 5, level: "S", status: 1, monitor: "張經理"},
    {name: "張大偉", duration: "2026 Q1", score: 2, level: "C", status: 2, monitor: "王主管"},
    {name: "趙小芳", duration: "2026 Q1", score: 1, level: "D", status: 0, monitor: "李總監"},
    {name: "孫志強", duration: "2026 Q1", score: 1, level: "D", status: 1, monitor: "張經理"},
];


export const Performance = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [data, setData] = useState<EmployeePerformanceData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const result = await performanceApi.getAll();
            setData(result);
        } catch (e) {
            console.error('Failed to fetch performance data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDialogSubmit = async (formData: {
        name?: string;
        duration?: string;
        score?: number;
        level?: string;
        status?: number;
        monitor?: string
    }) => {
        try {
            const payload = {
                name: formData.name || '未知員工',
                duration: formData.duration || '2026 Q1',
                score: formData.score || 0,
                level: formData.level || 'B',
                status: formData.status ?? 0,
                monitor: formData.monitor || '待分配',
            };
            await performanceApi.add(payload);
            await fetchData();
        } catch (e) {
            console.error('Failed to add performance:', e);
        }
        setIsDialogOpen(false);
    };

    const handleGenerateData = async () => {
        try {
            await performanceApi.generateData(mockTestData);
            await fetchData();
        } catch (e) {
            console.error('Failed to generate test data:', e);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await performanceApi.deleteAll();
            await fetchData();
        } catch (e) {
            console.error('Failed to delete all data:', e);
        }
    };

    return (
        <section>
            {/* 卡片 */}
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-6`}>
                {dataItems.map(item => (<DataCard data={item} key={item.id} {...item} />))}
            </div>

            {/* 圖表區域 */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 my-6`}>
                <ChartCard data={gradeDistributionData} type="bar" title="等級分佈" className={`flex-1`}/>
                <ChartCard data={deptPerformanceData} type="horizontal-bar" title="部門績效對比" className={`flex-1`}/>
            </div>

            {/* 工具欄 */}
            <div className={`flex flex-col md:flex-row justify-between mb-6 gap-4`}>
                <div className={`flex gap-4 flex-col md:flex-row`}>
                    <ToolbarTextField prefixIcon={'📅 週期'} type={'select'}/>
                    <ToolbarTextField prefixIcon={'🏢 部門'} type={'select'}/>
                    <ToolbarTextField prefixIcon={'🌟 等級'} type={'select'}/>
                    <ToolbarTextField prefixIcon={' 狀態'} type={'select'}/>
                </div>
                <div className="flex gap-3 flex-col md:flex-row">
                    <CommonButton title={`+ 新增評估`} onPressed={() => setIsDialogOpen(true)}/>
                    {data.length === 0 && (
                        <CommonButton title={`生成測試數據`} onPressed={handleGenerateData} bgColor="purple"/>
                    )}
                    {data.length > 0 && (
                        <CommonButton title={`刪除所有數據`} onPressed={handleDeleteAll} bgColor="red"/>
                    )}
                </div>
            </div>

            {/* 表格 */}
            <div className={`${cardClasses} overflow-x-auto`}>
                {loading ? (
                    <div className="py-12 text-center text-slate-400">載入中...</div>
                ) : (
                    <PerformanceTable heads={tableHeads} data={data}/>
                )}
            </div>

            {/* 新增評估Dialog */}
            <PerformanceDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleDialogSubmit}
            />
        </section>
    );
};
