// 數據指標卡片（總人數、在職率那種）
export interface DataCardItem {
    id: string;
    label: string;
    icon?: string;
    value?: string;
    desc?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange';
}

interface DataCardProps {
    data: DataCardItem;
    className?: string;
}


export const DataCard = ({data, className}: DataCardProps) => {

    let bgColor = "";

    switch (data.color) {
        case "blue":
            bgColor = "bg-blue-50 dark:bg-blue-950";
            break;
        case "green":
            bgColor = "bg-blue-100 dark:bg-blue-950";
            break;
        case "purple":
            bgColor = "bg-purple-100 dark:bg-purple-950";
            break;
        case "orange":
            bgColor = "bg-orange-100 dark:bg-orange-950";
            break;
        default:
            bgColor = "bg-white dark:bg-zinc-800";
            break;
    }

    return (
        <div
            className={`flex flex-col rounded-xl p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 gap-5 ${bgColor} ${className}`}>
            <div className={`dark:text-white space-x-3`}>
                <span>
                    {data.label}
                </span>
                {/* icon */}
                <span className={`w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950`}>
                    {data.icon}
                </span>
            </div>
            <span className={`text-3xl font-bold text-slate-900 dark:text-slate-50`}>
                {data.value}
            </span>
            <span className={`text-xs text-slate-500 dark:text-slate-400`}>
                {data.desc}
            </span>
        </div>
    );
}