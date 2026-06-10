interface AppSwitchProps {
    label: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
}

export const AppSwitch = ({label, enabled, onChange}: AppSwitchProps) => {
    return (
        <label className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled ? 'bg-blue-500' : 'bg-slate-200 dark:bg-zinc-600'
                }`}
            >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}/>
            </button>
        </label>
    );
};
