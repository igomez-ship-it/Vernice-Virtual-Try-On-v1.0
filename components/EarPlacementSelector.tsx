
import React from 'react';

interface EarPlacementSelectorProps {
    activePlacement: number;
    onSelectPlacement: (placement: number) => void;
}

const EarPlacementSelector: React.FC<EarPlacementSelectorProps> = ({ activePlacement, onSelectPlacement }) => {
    const options = [
        { id: 1, label: 'Lóbulo' },
        { id: 2, label: 'Medio' },
        { id: 3, label: 'Superior' },
    ];

    return (
        <div className="w-full p-2 bg-[rgba(24,21,22,0.8)] border border-[#D5B488] rounded-xl flex justify-center items-center gap-2">
            {options.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => onSelectPlacement(id)}
                    className={`flex-1 text-center py-2 px-3 text-sm font-bold rounded-lg transition-colors duration-200
                        ${activePlacement === id 
                            ? 'bg-[#D5B488] text-[#181516]' 
                            : 'bg-transparent text-[#D5B488] hover:bg-[#D5B488]/20'
                        }`
                    }
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default EarPlacementSelector;
