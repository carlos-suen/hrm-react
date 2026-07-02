// 審批流裡可拖來拖去的卡片
import {CommonButton} from "./CommonButton.tsx";
import {useState} from "react";

export interface TestApproval {
    id: string;
    name: string;
    iconColor: string;
    type: string;
    duration: string;
    startTime: string;
    endTime: string;
    days: number;
    reason: string;
    isHandled?: boolean;
}

export interface Approval {
    id?: number;
    ename: string;
    type: number;
    start_time: string;
    end_time: string;
    reason: string;
    // 請假單狀態
    status: number;
    created_at?: string;
}

const approvalTypeMap: Record<number, string> = {
    0: "日假",
    1: "月假",
    2: "年假",
    3: "病假",
}

interface ApprovalsDraggableCardProps {
    data: Approval;
    className?: string;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
}

const calculateDays = (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
};

export const ApprovalsDraggableCard = ({
                                           data,
                                           className,
                                           onApprove,
                                           onReject,
                                       }: ApprovalsDraggableCardProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        if (!data.id) return;
        setIsDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", data.id.toString());
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };


    return (
        <div
            draggable={data.status === 0}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`flex w-full flex-col bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 ${data.status === 0 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} hover:shadow-md transition-all ${isDragging ? "opacity-50 shadow-lg scale-95" : ""} ${className}`}
        >
            <div className={`flex justify-between`}>
                <h3 className={`text-black dark:text-white`}>{data.ename}</h3>
                <span className={`bg-blue-100 text-blue-700 rounded-md px-1`}>{approvalTypeMap[data.type]}</span>
            </div>
            <span
                className="text-sm text-slate-500">{`${data.start_time} -> ${data.end_time} (${calculateDays(data.start_time, data.end_time)}天)`}</span>
            <span className={`text-sm text-slate-600 line-clamp-2`}>{data.reason}</span>

            {data.status === 0 ?
                <div className={`w-full h-px bg-gray-500 dark:bg-gray-300 my-3`}></div> : (
                    <div className={`shrink-0`}></div>)}

            {data.status === 0 ? (<div className="flex w-full gap-2">
                <CommonButton title="拒絕" className="flex-1" bgColor="red"
                              onPressed={() => data.id && onReject?.(data.id)}/>
                <CommonButton title="批准" className="flex-1" onPressed={() => data.id && onApprove?.(data.id)}/>
            </div>) : (<div className="shrink-0"/>)}</div>
    );
};
