interface ColoredAvatarProps {
    level: string;
    firstName: string;
    className?: string;
}


export const ColoredAvatar = ({level, firstName, className}: ColoredAvatarProps) => {


    const formattedLevel: string = level.toLowerCase();

    const bgColorClass: Record<string, string> = {
        s: 'bg-purple-500',
        a: 'bg-emerald-500',
        b: 'bg-blue-500',
        c: 'bg-orange-500',
        d: 'bg-red-500',
    }


    return (
        <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${bgColorClass[formattedLevel] ?? 'bg-slate-500'} ${className}`}>
            {firstName}
        </div>
    );
}