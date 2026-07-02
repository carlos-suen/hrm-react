// 培訓課程卡片
import { cardClasses } from "../constants/themeClasses.tsx";
import { CommonButton } from "./CommonButton.tsx";

export interface TrainingCourseInfo {
    id: number;
    title: string;
    type: string;
    desc?: string;
    startTime: string;
    endTime?: string;
    location?: string;
    maxPeople?: number;
    currentJoin?: number;
    status?: string;
    instructor?: string;
}

interface TrainingCardProps {
    course: TrainingCourseInfo;
    onEnroll?: (id: number) => void;
    onDetail?: (id: number) => void;
}

const typeBadgeClasses: Record<string, string> = {
    '技術': "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    '管理': "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    '合規': "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    '入職': "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const statusBadgeClasses: Record<string, string> = {
    '即將開始': "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    '進行中': "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    '已結束': "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const isFull = (course: TrainingCourseInfo) => {
    if (!course.maxPeople || !course.currentJoin) return false;
    return course.currentJoin >= course.maxPeople;
};

export const TrainingCard = ({ course, onEnroll, onDetail }: TrainingCardProps) => {
    const full = isFull(course);
    const progressPercent = course.maxPeople && course.currentJoin
        ? Math.round((course.currentJoin / course.maxPeople) * 100)
        : 0;

    return (
        <div className={`${cardClasses} p-5`}>
            {/* Header: Type + Status */}
            <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeBadgeClasses[course.type]}`}>
                    {course.type}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadgeClasses[course.status || '']}`}>
                    {course.status}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{course.title}</h3>

            {/* Instructor */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                講師：{course.instructor}
            </p>

            {/* Date + Location */}
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {course.startTime}{course.endTime ? ` ~ ${course.endTime}` : ''}
                </div>
                <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {course.location}
                </div>
            </div>

            {/* Enrollment Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>報名人數</span>
                    <span>{course.currentJoin}/{course.maxPeople}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${full ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <CommonButton title={`${full ? '已滿' : '報名'}`} bgColor={full ? 'grey' : 'blue'} onPressed={() => onEnroll?.(course.id)} />
                <CommonButton title="詳情" onPressed={() => onDetail?.(course.id)} bgColor="green" />
            </div>
        </div>
    );
};
