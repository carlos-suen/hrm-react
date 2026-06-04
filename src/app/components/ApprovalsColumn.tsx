import {ApprovalsDraggableCard, type Approval} from "./ApprovalsDragableCard.tsx";
import {useState} from "react";
import * as React from "react";

interface ApprovalsColumnProps {
    title: string;
    approvals: Approval[];
    className?: string;
    columnKey: string;
    onDragEnd?: (cardId: string, targetColumn: string) => void;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
}

export const ApprovalColumn = ({
                                   title,
                                   approvals,
                                   className,
                                   columnKey,
                                   onDragEnd,
                                   onApprove,
                                   onReject,
                               }: ApprovalsColumnProps) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const cardId = e.dataTransfer.getData("text/plain");

        if (!cardId) return;

        if (columnKey === "pending") {
            return;
        }

        if (onDragEnd) {
            onDragEnd(cardId, columnKey);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-slate-100 dark:bg-zinc-800/50 rounded-xl p-4 transition-colors flex flex-col h-full ${isDragOver ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""} ${className}`}
        >
            <h2 className={`dark:text-white text-black mb-4 text-center font-medium`}>{title}</h2>
            <div className="space-y-3 overflow-y-auto flex-1">
                {approvals.map(approval => (
                    <ApprovalsDraggableCard
                        key={approval.id}
                        data={approval}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                ))}
            </div>
        </div>
    );
};
