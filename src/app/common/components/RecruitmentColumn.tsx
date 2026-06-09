import { JobCard } from "./JobCard.tsx";

export type RecruitmentStatus = 'open' | 'paused' | 'closed';

export interface RecruitmentJob {
    id: number;
    title: string;
    department: string;
    location: string;
    salaryMin: string;
    salaryMax: string;
    applicantCount: number;
    type: '全職' | '實習' | '兼職';
    status: RecruitmentStatus;
}

interface RecruitmentColumnProps {
    title: string;
    jobs: RecruitmentJob[];
    status: RecruitmentStatus;
    className?: string;
    onEdit?: (id: number) => void;
}

const columnBgClasses: Record<RecruitmentStatus, string> = {
    open: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
    paused: "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800",
    closed: "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700",
};

const dotColorClasses: Record<RecruitmentStatus, string> = {
    open: "bg-green-500",
    paused: "bg-yellow-500",
    closed: "bg-slate-400",
};

const textColorClass: Record<string, string> = {
    '開放中': 'text-green-500',
    '暫停': 'text-yellow-500',
    '已關閉': 'text-slate-400'
}


export const RecruitmentColumn = ({title, jobs, status, className, onEdit}: RecruitmentColumnProps) => {
    return (
        <div className={`${columnBgClasses[status]} rounded-xl p-4 border flex flex-col h-full ${className}`}>
            {/* 標題 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColorClasses[status]}`}/>
                    <h2 className={`font-sm ${textColorClass[title]}`}>{title}</h2>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">{jobs.length}</span>
            </div>

            {/* Job cards */}
            <div className="space-y-3 overflow-y-auto flex-1">
                {jobs.map(job => (
                    <JobCard
                        key={job.id}
                        id={job.id}
                        title={job.title}
                        department={job.department}
                        location={job.location}
                        salaryMin={job.salaryMin}
                        salaryMax={job.salaryMax}
                        applicantCount={job.applicantCount}
                        type={job.type}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </div>
    );
};
