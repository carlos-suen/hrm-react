export interface SelectOption {
    value: number | string;
    label: string;
}

interface ToolbarTextFieldProps {
    type?: 'input' | 'select';
    prefixIcon?: string;
    hintText?: string;
    trailingIcon?: string;
    value?: string;
    onChange?: (value: string) => void;
    options?: SelectOption[];
    className?: string;
}


export const ToolbarTextField = ({
                                     type = 'input',
                                     prefixIcon,
                                     hintText,
                                     trailingIcon,
                                     value,
                                     onChange,
                                     options = [],
                                     className = ''
                                 }: ToolbarTextFieldProps) => {
    const baseClasses = "space-x-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none transition-colors";
    const commonInputClass = type === 'input' ? "w-full md:w-auto" : "w-full md:w-auto";


    switch (type) {
        case 'input':
            return (
                <div className={`relative flex items-center ${commonInputClass} ${className}`}>
                    {prefixIcon && (
                        <span className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                            {prefixIcon}
                        </span>
                    )}
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={hintText}
                        className={`${baseClasses} ${prefixIcon ? 'pl-8' : ''} ${trailingIcon ? 'pr-8' : ''}`}
                    />
                    {trailingIcon && (
                        <span className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                            {trailingIcon}
                        </span>
                    )}
                </div>
            );
        case 'select':
            return (
                <div className={`flex ${baseClasses} items-center ${commonInputClass} ${className}`}>
                    {prefixIcon && (<span
                            className="pl-1 text-slate-400 dark:text-slate-500 text-sm pointer-events-none">
                        {prefixIcon}
                    </span>
                    )}
                    <select
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className={`focus:border-none cursor-pointer -translate-y-px`}
                    >
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {trailingIcon && (
                        <span className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                            {trailingIcon}
                        </span>
                    )}
                </div>
            );
    }


}
