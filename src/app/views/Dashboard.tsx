import {DataCard} from "../components/DataCard.tsx";
import type {DataCardItem} from "../components/DataCard.tsx";
import {ChartCard, type ChartData} from "../components/ChartCard.tsx";
import {useState, useEffect} from "react";
import {supabase} from "../../lib/supabase.ts";

const dataItems: DataCardItem[] = [
    {id: "total-employees", label: "總員工數", icon: "👥", value: "42", desc: "較上月 +3"},
    {id: "employment-rate", label: "在職率", icon: "✅", value: "85.7%", desc: "較上月 +2%"},
    {id: "salary-expense", label: "薪資支出", icon: "💰", value: "¥528,000", desc: "較上月 +8%"},
    {id: "pending-approvals", label: "待審批", icon: "⏰", value: "4", desc: "待處理"},
];


export const Dashboard = () => {
    // 餅圖相關數據（部門人數分佈）
    const [pieChartData, setPieChartData] = useState<ChartData[]>([]);

    // 柱狀圖的相關數據（部門薪資對比）
    const [barChartData, setBarChartData] = useState<ChartData[]>([]);


    // 獲取餅圖數據：按部門統計人數
    const fetchPieChartData = async () => {
        const {data, error} = await supabase
            .from('workers')
            .select('department');

        if (error) {
            console.error('獲取部門數據失敗:', error);
            return;
        }

        // 按部門分組統計
        const departmentCount: Record<string, number> = {};
        data?.forEach(item => {
            departmentCount[item.department] = (departmentCount[item.department] || 0) + 1;
        });

        // 轉換為 ChartData 格式
        const result: ChartData[] = Object.entries(departmentCount).map(([name, value]) => ({
            name,
            value
        }));

        setPieChartData(result);
    };

    // 獲取柱狀圖數據：按部門計算平均薪資
    const fetchBarChartData = async () => {
        const {data, error} = await supabase
            .from('workers')
            .select('department, sal');

        if (error) {
            console.error('獲取薪資數據失敗:', error);
            return;
        }

        // 按部門分組計算平均薪資
        const departmentSalary: Record<string, { total: number; count: number }> = {};
        data?.forEach(item => {
            if (!departmentSalary[item.department]) {
                departmentSalary[item.department] = {total: 0, count: 0};
            }
            departmentSalary[item.department].total += item.sal;
            departmentSalary[item.department].count += 1;
        });

        // 轉換為 ChartData 格式
        const result: ChartData[] = Object.entries(departmentSalary).map(([name, {total, count}]) => ({
            name,
            value: Math.round(total / count)
        }));

        setBarChartData(result);
    };

    // 組件掛載時獲取數據
    useEffect(() => {
        fetchPieChartData();
        fetchBarChartData();
    }, []);


    return (
        <section>
            {/*數據卡片區域*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dataItems.map(item => (
                    <DataCard key={item.id} data={item}/>
                ))}
            </div>

            {/* 圖表區域 */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6`}>
                <ChartCard type="pie" data={pieChartData}/>
                <ChartCard data={barChartData}/>
            </div>
        </section>


    );
};


