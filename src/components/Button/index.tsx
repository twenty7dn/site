import Link from 'next/link';
import React, {ButtonHTMLAttributes, MouseEventHandler, ReactNode} from "react";
import {createComponent} from "@/utils/class-tools";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'subtle' | 'normal' | undefined,
    size?: 'default' | 'small' | undefined,
    href?: string,
    target?: React.HTMLAttributeAnchorTarget,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    className?: string,
    children: ReactNode,
    external?: boolean | false
}

const buttonVariants = createComponent<ButtonProps>({
    variants: {
        variant: {
            primary: 'bg-amber-400 [text-shadow:0_1px_0_var(--color-amber-300)] shadow-button-primary active:shadow-button-active-primary hover:contrast-125 active:brightness-85',
            subtle: 'bg-backdrop/25 [text-shadow:0_1px_0_var(--color-background)] shadow-button-subtle',
            normal: 'bg-button-bg [text-shadow:0_1px_0_var(--color-background)] shadow-button active:shadow-button-active hover:contrast-115 active:brightness-90'
        },
        size: {
            default: 'py-0.5 px-2 lg:py-1 lg:px-3 font-medium text-base lg:text-md tracking-tighter',
            small: 'py-0.5 px-1 lg:py-1 lg:px-2 text-sm lg:text-xs tracking-tighter',
        }
    },
    defaultVariants: {
        variant: 'normal',
        size: 'default',
    }
});

const Button: React.FC<ButtonProps> = (props) => {
    const {variant = 'normal', size = 'default', href, target, onClick, children} = props;
    const buttonClasses = buttonVariants(
        'inline-block font-mono rounded cursor-pointer active:translate-y-0.25 transition-all duration-200 edge:button select-none',
        props
    );

    const innerContent = (
        <div className="relative bottom-[0.05rem] flex flex-row gap-x-0.5 items-center">
            {children}
        </div>
    );

    if (href) {
        return (
            <Link href={href} target={target} className={buttonClasses}>
                {innerContent}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={buttonClasses}>
            {innerContent}
        </button>
    );
};

export default Button;
