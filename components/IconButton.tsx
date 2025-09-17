import React from 'react';

interface IconButtonProps {
    position: 'top-left' | 'top-right' | 'bottom-right';
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ position, onClick, title, children, disabled = false }) => {
    const positionClasses = {
        'top-left': 'top-5 left-5',
        'top-right': 'top-5 right-5',
        'bottom-right': 'bottom-5 right-5',
    };

    return (
        <button
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`absolute z-20 bg-[rgba(24,21,22,0.7)] border-2 border-[#D5B488] rounded-full w-12 h-12 flex justify-center items-center cursor-pointer pointer-events-auto transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${positionClasses[position]}`}
        >
            {children}
        </button>
    );
};

export default IconButton;