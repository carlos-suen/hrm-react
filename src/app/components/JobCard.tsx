import {cardClasses} from "../common/themeClasses.tsx";
import {CommonButton} from "./CommonButton.tsx";

export interface JobCardProps {
    id: number;
    title: string;
    department: string;
    location: string;
    salaryMin: string;
    salaryMax: string;
    applicantCount: number;
    type: '全職' | '實習' | '兼職';
    onEdit?: (id: number) => void;
    onDetail?: (id: number) => void;
}

const typeBadgeClasses: Record<string, string> = {
    '全職': "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    '實習': "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    '兼職': "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export const JobCard = ({
                            id,
                            title,
                            department,
                            location,
                            salaryMin,
                            salaryMax,
                            applicantCount,
                            type,
                            onEdit,
                            onDetail
                        }: JobCardProps) => {
    return (
        <div className={`${cardClasses} p-5`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${typeBadgeClasses[type]}`}>
                    {type}
                </span>
            </div>

            {/* Department & Location */}
            <p className="text-base text-slate-500 dark:text-slate-400 mb-3">
                {department} · {location}
            </p>

            {/* Salary */}
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                ¥{salaryMin} - ¥{salaryMax}
            </p>

            {/* Applicants */}
            <div className="flex items-center gap-2 text-base text-slate-500 dark:text-slate-400 mb-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                {applicantCount} 位候選人
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-700 my-4"/>

            {/* Actions */}
            <div className="flex gap-3">
                <CommonButton
                    onPressed={() => onEdit?.(id)}
                    title={`編輯`}
                />
                <CommonButton
                    onPressed={() => onDetail?.(id)}
                    title={`詳細`}
                    bgColor={`green`}
                />
            </div>
        </div>
    );
};
