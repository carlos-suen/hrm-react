import type {ReactNode} from "react";
import {ContentHeader} from "./ContentHeader.tsx";

interface ContentProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export const Content = ({title, subtitle, children}: ContentProps) => {
    return (
        <div className="flex flex-col h-full">
            <ContentHeader title={title} subtitle={subtitle} />

            <div className="flex-1 p-6 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};
