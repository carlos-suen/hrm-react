export interface ReportDataCardProps {
    id: string;
    label: string;
    desc: string;
    icon: string;
    color: string;
}

export const ReportDataCard = ({label, desc, icon, color}: ReportDataCardProps) => {
    return (
        <div className="bg-white rounded-lg p-6 flex flex-col justify-between">
            <div>
                <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </div>
            <button className="text-blue-600 text-sm font-medium mt-4 hover:text-blue-700 text-left">
                查看報表
            </button>
        </div>
    );
};
