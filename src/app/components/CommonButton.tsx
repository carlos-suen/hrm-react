interface CommonButtonProps {
    title: string;
    onPressed?: () => void;
    bgColor?: "green" | "red" | "blue" | "purple";
    className?: string;
}

export const CommonButton = ({title, onPressed, bgColor = 'blue', className}: CommonButtonProps) => {

    const bgColorClass = {
        green: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
        red: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
        blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
        purple: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500",
    }


    return (
        <button
            className={`${bgColorClass[bgColor]} text-white rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 whitespace-nowrap ${className}`}
            onClick={onPressed}>
            {title}
        </button>
    );
}