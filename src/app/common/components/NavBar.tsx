// @deprecated 頂部導航欄，暫時沒用到，改用 Sidebar 佈局了
interface NavBarItem {
    icon?: string;
    title: string;
}

interface NavBarProps {
    tags?: NavBarItem[];

    className?: string;
}

// NavBar的標題
const NavBarHeader = () => {
    return <div className="bg-blue-500 flex justify-center p-6 border-b">
        <h1 className="text-white text-lg font-bold">HRM</h1>
    </div>;
}


export const NavBar = ({tags = [], className}: NavBarProps) => {
    return (
        <nav className={`flex flex-col bg-red-500 gap-4 h-screen md:h-screen lg:h-screen md:w-64 lg:w-64 w-full ${className ?? ""} `}>
            {/* 標題 */}
            <NavBarHeader/>

            {tags.map((tag, index) => {
                return (
                    <div
                        key={`${tag.title}-${index}`}
                        className="flex justify-between transition-transform duration-200
                        text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-blue-50 dark:active:bg-blue-950 active:text-blue-600 active:dark:text-blue-400 active:rounded-lg active:px-3 active:py-2"
                    >
                        {tag.icon && <span>{tag.icon}</span>}
                        <span className={`flex-1 truncate`}>{tag.title}</span>


                    </div>
                );
            })}
        </nav>
    );
}


