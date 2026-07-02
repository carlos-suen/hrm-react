// 通用信息彈窗
import {useEffect, type ReactNode} from "react";

//
interface InfoDialogProps {
    isOpen: boolean;
    title: string;
    content: string | ReactNode;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    className?: string;
    isDelete?: boolean;
    maxWidth?: string;
}


export const InfoDialog = ({
                               isOpen,
                               title,
                               content,
                               cancelText = '取消',
                               confirmText = '確定',
                               onConfirm,
                               onCancel,
                               isDelete = false,
                               className,
                               maxWidth = 'max-w-lg'
                           }: InfoDialogProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // 當false的時候返回null, 所以不展示任何內容
    if (!isOpen) return null;

    const handleClose = () => {
        onCancel?.();
    };

    const handleConfirm = () => {
        onConfirm?.();
    };

    // 當true的時候, 才會展示dialog
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* 添加這個之後就會導致點擊dialog外部的barrier都會退出dialog, 直接調整上述的背景色則不會, 原因是下方onClick綁定了handleClose()*/}
            {/*<div*/}
            {/*    className="absolute inset-0 bg-black/50"*/}
            {/*    onClick={handleClose}*/}
            {/*/>*/}
            <div
                className={`relative z-10 w-full ${maxWidth} mx-4 p-6 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-slate-700 shadow-xl ${className}`}>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">{title}</h3>
                {/* 這裡做判斷, 傳遞文字直接顯示文字, 傳遞組件直接顯示組件*/}
                {typeof content === 'string' ?
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{content}</p> : content}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-zinc-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-700"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm rounded-lg ${isDelete ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
