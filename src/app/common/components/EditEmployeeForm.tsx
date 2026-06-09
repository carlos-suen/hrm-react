import type {SelectOption} from "./ToolbarTextField.tsx";

interface EmployeeFormData {
    id: string;
    eid: string;
    name: string;
    department: string;
    pos: string;
    sal: string;
    start_date: string;
    status: string;
}

interface EditEmployeeFormProps {
    formData: EmployeeFormData;
    onChange: (field: keyof EmployeeFormData, value: string) => void;
    departmentOptions: SelectOption[];
}

export const EditEmployeeForm = ({formData, onChange, departmentOptions}: EditEmployeeFormProps) => {
    return (
        <div className={`space-y-3 pb-4`}>
            <div className={`flex flex-col gap-y-1`}>
                <div className={`flex gap-1`}>
                    <span className={`text-black dark:text-white text-sm`}>工號</span>
                    <span className={`text-[14px] text-red-500`}>*</span>
                </div>
                <input
                    className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="請輸入工號..."
                    value={formData.eid}
                    onChange={(e) => onChange('eid', e.target.value)}
                />
            </div>
            <div className={`flex flex-col gap-y-1`}>
                <div className={`flex gap-1`}>
                    <span className={`text-black dark:text-white text-sm`}>姓名</span>
                    <span className={`text-[14px] text-red-500`}>*</span>
                </div>
                <input
                    className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="請輸入姓名..."
                    value={formData.name}
                    onChange={(e) => onChange('name', e.target.value)}
                />
            </div>

            {/**/}
            <div className={`flex flex-row gap-x-2`}>
                {/* 部門 */}
                <div className={`flex flex-col gap-y-1 flex-1`}>
                    <div className={`flex gap-1`}>
                        <span className={`text-black dark:text-white text-sm`}>部門</span>
                        <span className={`text-[14px] text-red-500`}>*</span>
                    </div>
                    <select
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                        value={formData.department}
                        onChange={(e) => onChange('department', e.target.value)}
                    >
                        <option value="">請選擇部門</option>
                        {departmentOptions.filter(opt => opt.value !== 'all').map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                {/* 狀態 */}
                <div className={`flex flex-col gap-y-1 flex-1`}>
                    <div className={`flex gap-1`}>
                        <span className={`text-black dark:text-white text-sm`}>狀態</span>
                        <span className={`text-[14px] text-red-500`}>*</span>
                    </div>
                    <select
                        className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                        value={formData.status}
                        onChange={(e) => onChange('status', e.target.value)}
                    >
                        <option value="1">Active</option>
                        <option value="2">On Leave</option>
                        <option value="3">Terminated</option>
                    </select>
                </div>
            </div>

            <div className={`flex flex-col gap-y-1`}>
                <div className={`flex gap-1`}>
                    <span className={`text-black dark:text-white text-sm`}>職位</span>
                    <span className={`text-[14px] text-red-500`}>*</span>
                </div>
                <input
                    className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="請輸入職位..."
                    value={formData.pos}
                    onChange={(e) => onChange('pos', e.target.value)}
                />
            </div>
            <div className={`flex flex-row gap-x-2`}>
                <div className={`flex flex-col gap-y-1 flex-1`}>
                    <div className={`flex gap-1`}>
                        <span className={`text-black dark:text-white text-sm`}>薪資</span>
                        <span className={`text-[14px] text-red-500`}>*</span>
                    </div>
                    <input
                        type="number"
                        className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="請輸入薪資..."
                        value={formData.sal}
                        onChange={(e) => onChange('sal', e.target.value)}
                    />
                </div>
                {/* 入職日期 */}
                <div className={`flex flex-col gap-y-1 flex-1`}>
                    <div className={`flex gap-1`}>
                        <span className={`text-black dark:text-white text-sm`}>入職日期</span>
                        <span className={`text-[14px] text-red-500`}>*</span>
                    </div>
                    <input
                        type="date"
                        className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        value={formData.start_date}
                        onChange={(e) => onChange('start_date', e.target.value)}
                    />
                </div>
            </div>

        </div>
    );
};
