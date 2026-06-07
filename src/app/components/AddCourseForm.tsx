import type { SelectOption } from "./ToolbarTextField.tsx";

interface CourseFormData {
    title: string;
    instructor: string;
    type: string;
    startDate: string;
    endDate: string;
    duration: string;
    capacity: string;
    location: string;
    description: string;
}

interface AddCourseFormProps {
    formData: CourseFormData;
    onChange: (field: keyof CourseFormData, value: string) => void;
    typeOptions: SelectOption[];
    onCancel: () => void;
    onSubmit: () => void;
}

const inputClasses = "w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
const labelClasses = "text-black dark:text-white text-sm";
const requiredStar = <span className="text-[14px] text-red-500">*</span>;

export const AddCourseForm = ({ formData, onChange, typeOptions, onCancel, onSubmit }: AddCourseFormProps) => {
    return (
        <div className="space-y-4">
            {/* 課程名稱 */}
            <div className="flex flex-col gap-y-1">
                <div className="flex gap-1">
                    <span className={labelClasses}>課程名稱</span>
                    {requiredStar}
                </div>
                <input
                    className={inputClasses}
                    placeholder="請輸入課程名稱"
                    value={formData.title}
                    onChange={(e) => onChange('title', e.target.value)}
                />
            </div>

            {/* 講師 & 類別 */}
            <div className="flex flex-row gap-x-3">
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>講師</span>
                        {requiredStar}
                    </div>
                    <input
                        className={inputClasses}
                        placeholder="請輸入講師姓名"
                        value={formData.instructor}
                        onChange={(e) => onChange('instructor', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>類別</span>
                        {requiredStar}
                    </div>
                    <select
                        className={`${inputClasses} cursor-pointer`}
                        value={formData.type}
                        onChange={(e) => onChange('type', e.target.value)}
                    >
                        <option value="">請選擇類別</option>
                        {typeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 開始日期 & 結束日期 */}
            <div className="flex flex-row gap-x-3">
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>開始日期</span>
                        {requiredStar}
                    </div>
                    <input
                        type="date"
                        className={inputClasses}
                        value={formData.startDate}
                        onChange={(e) => onChange('startDate', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>結束日期</span>
                        {requiredStar}
                    </div>
                    <input
                        type="date"
                        className={inputClasses}
                        value={formData.endDate}
                        onChange={(e) => onChange('endDate', e.target.value)}
                    />
                </div>
            </div>

            {/* 時長 & 容量 */}
            <div className="flex flex-row gap-x-3">
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>時長（小時）</span>
                        {requiredStar}
                    </div>
                    <input
                        type="number"
                        className={inputClasses}
                        placeholder="例: 24"
                        value={formData.duration}
                        onChange={(e) => onChange('duration', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>容量</span>
                        {requiredStar}
                    </div>
                    <input
                        type="number"
                        className={inputClasses}
                        placeholder="例: 25"
                        value={formData.capacity}
                        onChange={(e) => onChange('capacity', e.target.value)}
                    />
                </div>
            </div>

            {/* 地點 */}
            <div className="flex flex-col gap-y-1">
                <div className="flex gap-1">
                    <span className={labelClasses}>地點</span>
                    {requiredStar}
                </div>
                <input
                    className={inputClasses}
                    placeholder="請輸入培訓地點"
                    value={formData.location}
                    onChange={(e) => onChange('location', e.target.value)}
                />
            </div>

            {/* 課程描述 */}
            <div className="flex flex-col gap-y-1">
                <div className="flex gap-1">
                    <span className={labelClasses}>課程描述</span>
                    {requiredStar}
                </div>
                <textarea
                    className={`${inputClasses} resize-none`}
                    rows={3}
                    placeholder="請輸入課程描述..."
                    value={formData.description}
                    onChange={(e) => onChange('description', e.target.value)}
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    onClick={onCancel}
                    className="px-6 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-700 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-600 transition-colors"
                >
                    取消
                </button>
                <button
                    onClick={onSubmit}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    提交
                </button>
            </div>
        </div>
    );
};
