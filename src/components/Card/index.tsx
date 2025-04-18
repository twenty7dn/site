import React, { ReactNode } from 'react';
import { cn } from "@/utils/class-tools";

export interface CardProps {
    header?: ReactNode;
    footer?: ReactNode[] | undefined;
    className?: string;
    children?: ReactNode;
}

const Card: React.FC<CardProps> = ({ header, footer = [], className, children }) => {
    return (
        <div className={cn(
            'py-2 px-3 bg-button-bg rounded-sm shadow-button-subtle edge:button-subtle',
            className
        )}>
            <div className="flex flex-col gap-y-1.5 h-full">
                {header}
                <div className="relative flex-grow">
                    {children}
                </div>
                {footer && footer.length > 0 && (
                    <div className={'flex flex-row gap-x-1 items-center h-3 font-mono font-medium text-xs tracking-tighter leading-3 select-none'}>
                        {footer.map((item, i) => (
                            <React.Fragment key={i}>
                                {item}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

interface SpacerProps {
    className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({ className = "" }) => {
    return (
        <div className={cn(
            'inline-flex flex-grow bg-border-soft/30 h-2.25 -translate-px rounded-xs',
            className
        )}></div>
    );
}

export default Card;
