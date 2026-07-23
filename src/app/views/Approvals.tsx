import {ApprovalColumn} from "../common/components/ApprovalsColumn.tsx";
import {useEffect, useState} from "react";
import {CommonButton} from "../common/components/CommonButton.tsx";
import {approvalApi} from "../../server/lib/api.ts";
import type {Approval} from "../common/components/ApprovalsDragableCard.tsx";

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

        try {
            const data = await approvalApi.updateStatus(Number(cardId), {status: newStatus});

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

            switch (targetColumn) {
                case "pending":
                    setPendingApprovals(prev => [...prev, data]);
                    break;
                case "approved":
                    setApprovedApprovals(prev => [...prev, data]);
                    break;
                case "rejected":
                    setRejectedApprovals(prev => [...prev, data]);
                    break;
            }
        } catch (err) {
            console.error("拖動更新失敗:", err);
        }
    };


    // 獲取所有待處理
    const fetchAllPendingApprovals = async () => {
        try {
            const data = await approvalApi.getPending();
            setPendingApprovals(data);
        } catch (err) {
            console.error('獲取待處理的事項失敗, 原因:', err);
        }
    }

    // 獲取所有已批准
    const fetchAllApprovedApprovals = async () => {
        try {
            const data = await approvalApi.getApproved();
            setApprovedApprovals(data);
        } catch (err) {
            console.error('獲取已批准的事項失敗, 原因:', err);
        }
    }

    // 獲取所有已拒絕
    const fetchAllRejectedApprovals = async () => {
        try {
            const data = await approvalApi.getRejected();
            setRejectedApprovals(data);
        } catch (err) {
            console.error('獲取已拒絕的事項失敗, 原因:', err);
        }
    }

    // 清空所有的內容
    const clearAllData = async () => {
        try {
            await approvalApi.clearAll();
            setPendingApprovals([]);
            setApprovedApprovals([]);
            setRejectedApprovals([]);
        } catch (err) {
            console.error("清空失敗, 原因: ", err);
        }
    }

    // 生成待處理數據
    const generatePendingApprovals = async () => {
        try {
            // 移除 id 字段，讓後端自動生成
            const dataToInsert = testPendingApprovalsData.map(({id, ...rest}) => rest);
            const data = await approvalApi.generateApprovals(dataToInsert);
            setPendingApprovals(prev => [...data, ...prev]);
        } catch (err) {
            console.error('生成測試數據失敗:', err);
        }
    }


    //
    const updatePendingApprovalStatus = async (approvalId: number, newStatus: number) => {
        const targetApproval = pendingApprovals.find(item => item.id === approvalId);
        if (!targetApproval) return;

        const updatedApproval = {...targetApproval, status: newStatus};

        try {
            await approvalApi.updateStatus(approvalId, {status: newStatus});

            if (newStatus === 1) {
                setApprovedApprovals(prev => [...prev, updatedApproval]);
            } else if (newStatus === 2) {
                setRejectedApprovals(prev => [...prev, updatedApproval]);
            }

            setPendingApprovals(prev => prev.filter(item => item.id !== approvalId));
        } catch (err) {
            console.error("更新失敗, 原因: ", err);
        }
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
