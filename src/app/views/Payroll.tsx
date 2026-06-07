import {DataCard, type DataCardItem} from "../components/DataCard.tsx";
import {ChartCard} from "../components/ChartCard.tsx";
import {cardClasses} from "../common/themeClasses.tsx";
import {ToolbarTextField} from "../components/ToolbarTextField.tsx";
import {departmentOptions, statusOptions} from "./Directory.tsx";
import {PayDetailTable, type PayRecord} from "../components/PayMemberDetailTable.tsx";
import {MemberPayDetailCard} from "../components/MemberPayDetailCard.tsx";
import {useState} from "react";
import {CommonButton} from "../components/CommonButton.tsx";


const payRollData: DataCardItem[] = [
    {id: "total-payroll", label: "本月薪資總覽", icon: "💰", value: "¥528,000"},
    {id: "avg-salary", label: "平均薪資", icon: "📊", value: "¥12,571"},
    {id: "max-salary", label: "最高薪資", icon: "⬆️", value: "¥28,000"},
    {id: "pending-payroll", label: "待確認薪資", icon: "📄", value: "4"},
];

const deptAvgSalaryData = [
    {name: "Eng", value: 28},
    {name: "HR", value: 20.5},
    {name: "Mkt", value: 18.5},
    {name: "Sales", value: 18},
    {name: "Fin", value: 22},
];

const salaryCompositionData = [
    {name: "基本工資", value: 65},
    {name: "獎金", value: 12},
    {name: "扣款", value: 8},
    {name: "五險一金", value: 10},
    {name: "個稅", value: 5},
];

const payTableData: PayRecord[] = [
    {
        id: 1,
        name: "張偉",
        email: "zhangwei@co.com",
        avatar: "張",
        department: "Eng",
        baseSalary: "¥28,000",
        bonus: "+¥3,200",
        deduction: "-¥560",
        netPay: "¥26,068",
        status: "Draft"
    },
    {
        id: 2,
        name: "李娜",
        email: "lina@co.com",
        avatar: "李",
        department: "HR",
        baseSalary: "¥25,000",
        bonus: "+¥2,500",
        deduction: "-¥0",
        netPay: "¥23,935",
        status: "Confirmed"
    },
];


export const Payroll = () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleToggleSelectAll = () => {
        setSelectedIds(prev =>
            prev.length === payTableData.length ? [] : payTableData.map(r => r.id)
        );
    };

    return (
        <section>
            {/* 薪資 */}
            <div className="grid grid-cols-4 gap-2">
                {payRollData.map(item => (
                    <DataCard key={item.id} data={item}/>
                ))}
            </div>

            {/* 圖表 */}
            <div className={`flex w-full gap-4 my-6`}>
                <ChartCard data={deptAvgSalaryData} type="bar" title="部門平均薪資對比" className={`flex-1`}/>
                <ChartCard data={salaryCompositionData} type="pie" title="薪資構成佔比" className={`flex-1`}/>
            </div>

            {/* 工具欄 */}
            <div className={`${cardClasses} flex gap-4 flex-col md:flex-row`}>
                <ToolbarTextField type="input" hintText="選擇日期..." prefixIcon="📅"/>
                <ToolbarTextField type="select" prefixIcon={`部門`} options={departmentOptions}/>
                <ToolbarTextField type="select" prefixIcon={`狀態`} options={statusOptions}/>
                <div className="flex-1"/>
                <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center">
                    生成薪資單
                </button>

            </div>

            {/* 當表格選中了相關的內容後, 這裡要出現相關的提示 */}
            {selectedIds.length > 0 && (
                <div className={`${cardClasses} flex items-center mt-6 gap-3`}>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        已選擇 <span className="font-semibold text-blue-600">{selectedIds.length}</span> 筆記錄
                    </span>
                    <div className="flex gap-3">
                        <CommonButton title={"批量確認"} bgColor={`blue`}/>
                        <CommonButton title={`批量發放`} bgColor={`green`}/>
                        <CommonButton title={`取消選擇`} bgColor={`red`}/>
                    </div>
                </div>
            )}


            {/* 表格 */}
            <div className="mt-6">
                <PayDetailTable
                    data={payTableData}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                />
            </div>

            {/* 單選時顯示薪資明細看板 */}
            {selectedIds.length === 1 && (() => {
                const selectedRecord = payTableData.find(r => r.id === selectedIds[0]);
                if (!selectedRecord) return null;
                return (
                    <MemberPayDetailCard
                        record={selectedRecord}
                        onCollapse={() => setSelectedIds([])}
                        onConfirm={() => console.log("確認", selectedRecord.id)}
                        onPay={() => console.log("發放", selectedRecord.id)}
                    />
                );
            })()}

        </section>
    );
}