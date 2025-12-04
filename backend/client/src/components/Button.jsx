import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        secondary: 'bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-500',
        outline: 'border border-current',
        ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-sm',
        md: 'px-6 py-3 sm:px-8 sm:py-4 text-base',
        lg: 'px-8 py-4 sm:px-10 sm:py-5 text-lg',
        icon: 'p-2',
    };

    return (
        <button
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="animate-pulse">LOADING...</span>
            ) : children}
        </button>
    );
};

export default Button;
