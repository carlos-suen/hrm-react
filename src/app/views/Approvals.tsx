import {ApprovalColumn} from "../components/ApprovalsColumn.tsx";
import {useEffect, useState} from "react";
import {CommonButton} from "../components/CommonButton.tsx";
import {supabase} from "../../lib/supabase.ts";
import type {Approval} from "../components/ApprovalsDragableCard.tsx";

const testPendingApprovalsData: Approval[] = [
    {
        id: 1,
        ename: "張三",
        type: 1,
        start_time: "2024-01-15",
        end_time: "2024-01-17",
        reason: "家中有事需處理",
        status: 0
    },
    {
        id: 2,
        ename: "李四",
        type: 2,
        start_time: "2024-01-20",
        end_time: "2024-01-24",
        reason: "需要住院手術",
        status: 0,
    },
    {
        id: 3,
        ename: "王五",
        type: 3,
        start_time: "2024-02-01",
        end_time: "2024-02-03",
        reason: "個人事務處理",
        status: 0,
    },
    {
        id: 4,
        ename: "趙六",
        type: 1,
        start_time: "2024-02-10",
        end_time: "2024-02-14",
        reason: "出國旅遊",
        status: 0,
    },
    {
        id: 5,
        ename: "陳七",
        type: 2,
        start_time: "2024-02-20",
        end_time: "2024-02-21",
        reason: "身體不適",
        status: 0,
    }
];

export const Approvals = () => {
    // 待處理
    const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);

    // 已批准
    const [approvedApprovals, setApprovedApprovals] = useState<Approval[]>([]);

    // 已拒絕
    const [rejectedApprovals, setRejectedApprovals] = useState<Approval[]>([]);

    // const [isAddApprovalDialogOpen, setIsAddApprovalDialogOpen] = useState<boolean>(false);

    const handleDragEnd = async (cardId: string, targetColumn: "pending" | "approved" | "rejected") => {
        let draggedCard: Approval | undefined;
        let sourceColumn: "pending" | "approved" | "rejected" | null = null;

        const pendingCard = pendingApprovals.find(c => c.id === Number(cardId));
        if (pendingCard) {
            draggedCard = pendingCard;
            sourceColumn = "pending";
        }

        const approvedCard = approvedApprovals.find(c => c.id === Number(cardId));
        if (approvedCard) {
            draggedCard = approvedCard;
            sourceColumn = "approved";
        }

        const rejectedCard = rejectedApprovals.find(c => c.id === Number(cardId));
        if (rejectedCard) {
            draggedCard = rejectedCard;
            sourceColumn = "rejected";
        }

        if (!draggedCard || sourceColumn === targetColumn) return;

        if (sourceColumn !== "pending" && targetColumn === "pending") {
            return;
        }

        const statusMap = {
            pending: 0,
            approved: 1,
            rejected: 2
        };

        const newStatus = statusMap[targetColumn];
        const {data, error} = await supabase
            .from("approvals")
            .update({status: newStatus})
            .eq("id", Number(cardId))
            .select();

        if (error) {
            console.error("拖動更新失敗:", error);
            return;
        }

        switch (sourceColumn) {
            case "pending":
                setPendingApprovals(prev => prev.filter(c => c.id !== Number(cardId)));
                break;
            case "approved":
                setApprovedApprovals(prev => prev.filter(c => c.id !== Number(cardId)));
                break;
            case "rejected":
                setRejectedApprovals(prev => prev.filter(c => c.id !== Number(cardId)));
                break;
        }

        if (data && data[0]) {
            switch (targetColumn) {
                case "pending":
                    setPendingApprovals(prev => [...prev, data[0]]);
                    break;
                case "approved":
                    setApprovedApprovals(prev => [...prev, data[0]]);
                    break;
                case "rejected":
                    setRejectedApprovals(prev => [...prev, data[0]]);
                    break;
            }
        }
    };


    // 獲取所有待處理
    const fetchAllPendingApprovals = async () => {
        const {data, error} = await supabase.from("approvals").select("*").eq("status", 0);

        if (error) {
            console.error('獲取待處理的事項失敗, 原因:', error);
            return;
        }

        setPendingApprovals(data || []);

    }

    // 獲取所有已批准
    const fetchAllApprovedApprovals = async () => {
        const {data, error} = await supabase.from("approvals").select("*").eq("status", 1);

        if (error) {
            console.error('獲取已批准的事項失敗, 原因:', error);
            return;
        }

        setApprovedApprovals(data || []);
    }

    // 獲取所有已拒絕
    const fetchAllRejectedApprovals = async () => {
        const {data, error} = await supabase.from("approvals").select("*").eq("status", 2);

        if (error) {
            console.error('獲取已拒絕的事項失敗, 原因:', error);
            return;
        }

        setRejectedApprovals(data || []);
    }

    // 清空所有的內容
    const clearAllData = async () => {

        const {error} = await supabase.from("approvals").delete().neq("id", 0);

        if (error) {
            console.error("清空失敗, 原因: ", error);
            return;
        }

        setPendingApprovals([]);
        setApprovedApprovals([]);
        setRejectedApprovals([]);
    }

    // 生成待處理數據
    const generatePendingApprovals = async () => {

        const {data, error} = await supabase.from("approvals").insert(testPendingApprovalsData).select();


        if (error) {
            console.error('生成測試數據失敗:', error);
            return;
        }

        setPendingApprovals(prev => [...(data || []), ...prev]);
    }


    //
    const updatePendingApprovalStatus = async (approvalId: number, newStatus: number) => {
        const {
            data,
            error
        } = await supabase.from("approvals").update({status: newStatus}).eq("id", approvalId).select();

        if (error) {
            console.error("更新失敗, 原因: ", error);
            return;
        }

        if (newStatus === 1) {
            setApprovedApprovals(prev => [...prev, ...(data || [])]);
        } else if (newStatus === 2) {
            setRejectedApprovals(prev => [...prev, ...(data || [])]);
        }

        setPendingApprovals(prev => prev.filter(item => item.id !== approvalId));

    }


    useEffect(() => {
        fetchAllPendingApprovals();
        fetchAllApprovedApprovals();
        fetchAllRejectedApprovals();
    }, []);

    return (
        <section className="h-full flex flex-col gap-4">
            <div className="flex w-full justify-between shrink-0">
                <div className="space-x-4">
                    <CommonButton title="生成測試數據" bgColor="purple" onPressed={() => {
                        generatePendingApprovals();
                    }}/>
                    <CommonButton title="清空所有數據" bgColor="red" onPressed={() => {
                        clearAllData();
                    }}/>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                <ApprovalColumn
                    title={`🟡 待處理 (${pendingApprovals.length})`}
                    approvals={pendingApprovals}
                    columnKey="pending"
                    onDragEnd={handleDragEnd}
                    onApprove={(id) => updatePendingApprovalStatus(id, 1)}
                    onReject={(id) => updatePendingApprovalStatus(id, 2)}
                />
                <ApprovalColumn
                    title={`🟢 已批准 (${approvedApprovals.length})`}
                    approvals={approvedApprovals}
                    columnKey="approved"
                    onDragEnd={handleDragEnd}
                />
                <ApprovalColumn
                    title={`🔴 已拒絕 (${rejectedApprovals.length})`}
                    approvals={rejectedApprovals}
                    columnKey="rejected"
                    onDragEnd={handleDragEnd}
                />
            </div>
        </section>
    );
}
