// 空狀態佔位圖 / 文案
interface EmptyHolderProps {
    icon?: string;
    title?: string;
    desc?: string;
    className?: string;
}

export const EmptyHolder = ({ icon, title, desc, className }: EmptyHolderProps) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 ${className ?? ''}`}>
            {icon && <span className="text-6xl mb-4">{icon}</span>}
            {title && (
                <p className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
                    {title}
                </p>
            )}
            {desc && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {desc}
                </p>
            )}
        </div>
    );
};
