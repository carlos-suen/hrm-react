import type {SelectOption} from "./ToolbarTextField.tsx";

interface RecruitmentFormData {
    title: string;
    department: string;
    type: string;
    location: string;
    salaryMin: string;
    salaryMax: string;
    description: string;
    requirements: string;
}

interface AddRecruitmentFormProps {
    formData: RecruitmentFormData;
    onChange: (field: keyof RecruitmentFormData, value: string) => void;
    departmentOptions: SelectOption[];
    typeOptions: SelectOption[];
}

const inputClasses = "w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
const labelClasses = "text-black dark:text-white text-sm";
const requiredStar = <span className="text-[14px] text-red-500">*</span>;

export const AddRecruitmentForm = ({
                                       formData,
                                       onChange,
                                       departmentOptions,
                                       typeOptions,
                                   }: AddRecruitmentFormProps) => {


    return (
        <div className="space-y-4">
            {/* 職位名稱 */}
            <div className="flex flex-col gap-y-1">
                <div className="flex gap-1">
                    <span className={labelClasses}>職位名稱</span>
                    {requiredStar}
                </div>
                <input
                    className={inputClasses}
                    placeholder="請輸入職位名稱"
                    value={formData.title}
                    onChange={(e) => onChange('title', e.target.value)}
                />
            </div>

            {/* 部門 & 職位類型 */}
            <div className="flex flex-row gap-x-3">
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>部門</span>
                        {requiredStar}
                    </div>
                    <select
                        className={`${inputClasses} cursor-pointer`}
                        value={formData.department}
                        onChange={(e) => onChange('department', e.target.value)}
                    >
                        <option value="">請選擇部門</option>
                        {departmentOptions.filter(opt => opt.value !== 'all').map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>職位類型</span>
                        {requiredStar}
                    </div>
                    <select
                        className={`${inputClasses} cursor-pointer`}
                        value={formData.type}
                        onChange={(e) => onChange('type', e.target.value)}
                    >
                        <option value="">請選擇類型</option>
                        {typeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 工作地點 */}
            <div className="flex flex-col gap-y-1">
                <div className="flex gap-1">
                    <span className={labelClasses}>工作地點</span>
                    {requiredStar}
                </div>
                <input
                    className={inputClasses}
                    placeholder="請輸入工作地點"
                    value={formData.location}
                    onChange={(e) => onChange('location', e.target.value)}
                />
            </div>

            {/* 最低薪資 & 最高薪資 */}
            <div className="flex flex-row gap-x-3">
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>最低薪資</span>
                        {requiredStar}
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                        <input
                            type="number"
                            className={`${inputClasses} pl-7`}
                            placeholder="最低"
                            value={formData.salaryMin}
                            onChange={(e) => onChange('salaryMin', e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-y-1 flex-1">
                    <div className="flex gap-1">
                        <span className={labelClasses}>最高薪資</span>
                        {requiredStar}
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                        <input
                            type="number"
                            className={`${inputClasses} pl-7`}
                            placeholder="最高"
                            value={formData.salaryMax}
                            onChange={(e) => onChange('salaryMax', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 職位描述 */}
            <div className="flex flex-col gap-y-1">
                <div className="flex gap-1">
                    <span className={labelClasses}>職位描述</span>
                    {requiredStar}
                </div>
                <textarea
                    className={`${inputClasses} resize-none`}
                    rows={3}
                    placeholder="請輸入職位描述..."
                    value={formData.description}
                    onChange={(e) => onChange('description', e.target.value)}
                />
            </div>

            {/* 任職要求 */}
            <div className="flex flex-col gap-y-1">
                <div className="flex gap-1">
                    <span className={labelClasses}>任職要求</span>
                    {requiredStar}
                </div>
                <textarea
                    className={`${inputClasses} resize-none mb-6`}
                    rows={2}
                    placeholder="請輸入任職要求..."
                    value={formData.requirements}
                    onChange={(e) => onChange('requirements', e.target.value)}
                />
            </div>
        </div>
    );
};
