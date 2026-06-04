interface HeaderInputProps {
    headerText: string;
    hintText?: string;
    isRequired?: boolean;
    className?: string;
}


export const HeaderInput = ({headerText, hintText, isRequired = true, className}: HeaderInputProps) => {

    const headerTextBaseClass = 'text-black dark:text-white text-sm';

    const baseInputClasses = "bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";

    return (
        <div className={`flex flex-col gap-y-1 ${className}`}>
            {isRequired ? <div className={`flex gap-1`}>
                <span className={`${headerTextBaseClass} `}>{headerText}</span>
                <span className={`text-[14px] text-red-500`}>*</span>
            </div> : <span className={`${headerTextBaseClass}`}>{headerText}</span>
            }
            <input className={`${baseInputClasses}`} placeholder={hintText}/>
        </div>
    );
}