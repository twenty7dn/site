import { clsx, ClassValue } from '@nberlette/clsx';
import { twMerge } from 'tailwind-merge';

// Core merge utility
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

// Component factory with variants
interface VariantConfig {
    variants: {
        [variantName: string]: {
            [variantValue: string]: string;
        };
    };
    defaultVariants?: {
        [variantName: string]: string;
};
}

type ComponentFunction<P> = (baseClasses: string, componentProps: P & { className?: string }) => string;

export function createComponent<P extends Record<string, any>>(config: VariantConfig): ComponentFunction<P> {
    return (baseClasses, componentProps) => {
    const { className, ...variantProps } = componentProps;

    const variantClasses: (string | undefined)[] = Object.entries(config.variants).map(
        ([key, variantOptions]) => {
            const userValue = variantProps[key] as string | undefined; // Or string | number | boolean if your variant values are not always strings
            const defaultValue = config.defaultVariants?.[key];

            const selectedVariant = userValue || defaultValue;
            return selectedVariant ? variantOptions[selectedVariant] : undefined; // Handle cases where variant or default is not found
        }
    );

    return cn(baseClasses, ...variantClasses.filter(Boolean), className); // Filter out undefined variantClasses
};
}
