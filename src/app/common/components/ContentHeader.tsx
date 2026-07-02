// 內容區那個標題 + 副標題的頭
interface ContentHeaderProps {
    title: string;
    subtitle: string;
    className?: string;
}


export const ContentHeader = ({title, subtitle, className}: ContentHeaderProps) => {
    return (
        <header className={`bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4 ${className}`}>
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            </div>
        </header>
    );
}
