import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', label, error, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">
                    {label}
                </label>
            )}
            <input
                className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right touch-manipulation ${error ? 'border-red-500' : ''} ${className}`}
                dir="auto"
                enterKeyHint="next"
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500 rtl:text-right">{error}</p>
            )}
        </div>
    );
};
