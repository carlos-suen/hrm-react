import { useAuthStore } from "../stores/authStore.ts";

/// 用戶信息面板：顯示當前登錄用戶，點擊觸發登出
export const UserInfoPanel = ({ isMobile=false,className }: { isMobile?: boolean; className?: string }) => {
    const user = useAuthStore((s) => s.user);
    const isLogin = useAuthStore((s) => s.is_login);
    const logout = useAuthStore((s) => s.logout);

    const displayName = isLogin && user ? (user.nickname || user.username) : null;
    const displayDesc = isLogin && user ? (user.role === 'admin' ? '管理員' : '普通用戶') : '點擊此處進行登錄...';

    const handlePressed = () => {
        if (isLogin) {
            if (window.confirm('確定要登出嗎？')) {
                logout();
            }
        }
    };

    return (
        <div className={`flex gap-2 cursor-pointer ${className}`} onClick={handlePressed}>
            {/* 頭像 */}
            <div
                className={`rounded-full bg-blue-500 dark:bg-blue-600 w-10 h-10 text-md text-white flex items-center justify-center`}>
                {displayName && displayName.length > 0 ? displayName[0] : '登'}
            </div>

            {/*用戶姓名+描述*/}
            {!isMobile?  <div className={`flex flex-col justify-center`}>
                <span className={`text-md font-bold text-black dark:text-white`}>
                    {displayName ?? '未登錄'}
                </span>
                <span className={`text-[12px] text-gray-500 dark:text-gray-600`}>
                    {displayDesc}
                </span>
            </div>:null}
        </div>
    );
}
