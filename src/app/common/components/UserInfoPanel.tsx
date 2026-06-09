interface UserInfoPanelProps {
    name?: string;
    desc?: string;
    onPressed?: () => void;
    className?: string;
}


/// 用戶信息
export const UserInfoPanel = ({name, desc, onPressed, className}: UserInfoPanelProps) => {
    return (
        <div className={`flex gap-2 cursor-pointer ${className}`} onClick={onPressed}>
            {/* 頭像 */}
            <div
                className={`rounded-full bg-blue-500 dark:bg-blue-600 w-10 h-10 text-md text-white flex items-center justify-center`}>
                {name != null && name.length > 0 ? name[0] : '登'}
            </div>

            {/*用戶姓名+描述*/}
            <div className={`flex flex-col justify-center`}>
                <span className={`text-md font-bold text-black dark:text-white`}>{name ? name : '未登錄'}</span>
                <span
                    className={`text-[12px] text-gray-500 dark:text-gray-600`}>{desc ? desc : '點擊此處進行登錄...'}</span>
            </div>
        </div>
    );
}