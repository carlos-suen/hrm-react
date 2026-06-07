import {DataCard, type DataCardItem} from "../components/DataCard.tsx";
import {ChartCard} from "../components/ChartCard.tsx";
import {cardClasses} from "../common/themeClasses.tsx";
import {ToolbarTextField} from "../components/ToolbarTextField.tsx";
import {departmentOptions, statusOptions} from "./Directory.tsx";
import {PayDetailTable, type PayRecord} from "../components/PayMemberDetailTable.tsx";
import {MemberPayDetailCard} from "../components/MemberPayDetailCard.tsx";
import {useState, useEffect} from "react";
import {CommonButton} from "../components/CommonButton.tsx";
import {payrollApi} from "../../server/lib/api.ts";


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

const formatPayRecord = (item: any): PayRecord => ({
    id: item.id,
    name: item.name,
    email: '',
    avatar: item.name.charAt(0),
    department: '',
    baseSalary: `¥${item.bsalary.toLocaleString()}`,
    bonus: `+¥${item.bonus.toLocaleString()}`,
    deduction: `-¥${item.deduction.toLocaleString()}`,
    netPay: `¥${item.asalary.toLocaleString()}`,
    status: item.status === 'Draft' ? 'Draft' : 'Confirmed',
});

const testPayrollData = [
    {name: "張偉", bsalary: 28000, bonus: 3200, deduction: 560, asalary: 26068, status: "Draft"},
    {name: "李娜", bsalary: 25000, bonus: 2500, deduction: 0, asalary: 23935, status: "Draft"},
    {name: "王強", bsalary: 22000, bonus: 1800, deduction: 440, asalary: 20892, status: "Draft"},
    {name: "趙敏", bsalary: 20000, bonus: 2000, deduction: 400, asalary: 18960, status: "Draft"},
    {name: "陳思", bsalary: 18000, bonus: 1500, deduction: 360, asalary: 17028, status: "Draft"},
];


export const Payroll = () => {
    const [records, setRecords] = useState<PayRecord[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<PayRecord | null>(null);

    // 獲取所有薪資記錄
    const fetchRecords = async () => {
        try {
            const data = await payrollApi.getAll();
            const formatted = data.map(formatPayRecord);
            setRecords(formatted);
        } catch (err) {
            console.error('獲取薪資記錄失敗:', err);
        }
    };

    // 生成測試數據
    const generatePayroll = async () => {
        try {
            const data = await payrollApi.generateRecords(testPayrollData);
            const formatted = data.map(formatPayRecord);
            setRecords(formatted);
        } catch (err) {
            console.error('生成測試數據失敗:', err);
        }
    };

    // 確認單條記錄
    const handleConfirm = async (id: number) => {
        try {
            const data = await payrollApi.updateStatus(id, { status: 'Confirmed' });
            const formatted = formatPayRecord(data);
            setRecords(prev => prev.map(r => r.id === id ? formatted : r));
            if (selectedDetail?.id === id) {
                setSelectedDetail(formatted);
            }
        } catch (err) {
            console.error('確認失敗:', err);
        }
    };

    // 取消選擇
    const handleCancelSelect = () => {
        setSelectedIds([]);
        setSelectedDetail(null);
    };

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            // 單選時獲取詳情
            if (next.length === 1) {
                const record = records.find(r => r.id === next[0]);
                if (record) setSelectedDetail(record);
            } else {
                setSelectedDetail(null);
            }
            return next;
        });
    };

    const handleToggleSelectAll = () => {
        setSelectedIds(prev => {
            const next = prev.length === records.length ? [] : records.map(r => r.id);
            if (next.length === 1) {
                const record = records.find(r => r.id === next[0]);
                if (record) setSelectedDetail(record);
            } else {
                setSelectedDetail(null);
            }
            return next;
        });
    };

    useEffect(() => {
        fetchRecords();
    }, []);

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
                {records.length === 0 && (
                    <CommonButton title={'生成測試數據'} bgColor="purple" onPressed={generatePayroll}/>
                )}
                <CommonButton title={'生成薪資單'} bgColor="blue" onPressed={generatePayroll}/>

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
                        <CommonButton title={`取消選擇`} bgColor={`red`} onPressed={handleCancelSelect}/>
                    </div>
                </div>
            )}


            {/* 表格 */}
            <div className="mt-6">
                {records.length > 0 ? (
                    <PayDetailTable
                        data={records}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                        onToggleSelectAll={handleToggleSelectAll}
                        onConfirm={handleConfirm}
                    />
                ) : (
                    <div className={`${cardClasses} flex flex-col items-center justify-center py-16`}>
                        <span className="text-6xl mb-4">💰</span>
                        <p className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
                            還沒有薪資記錄
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            點擊「生成薪資單」開始進行測試吧!
                        </p>
                    </div>
                )}
            </div>

            {/* 單選時顯示薪資明細看板 */}
            {selectedDetail && (
                <MemberPayDetailCard
                    record={selectedDetail}
                    onCollapse={handleCancelSelect}
                    onConfirm={() => handleConfirm(selectedDetail.id)}
                    onPay={() => console.log("發放", selectedDetail.id)}
                />
            )}

        </section>
    );
}