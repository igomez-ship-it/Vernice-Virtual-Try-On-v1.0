
import React from 'react';

type EarSide = 'left' | 'right' | 'both';

interface EarSelectorProps {
    activeSide: EarSide;
    onSelectSide: (side: EarSide) => void;
}

const EarSelector: React.FC<EarSelectorProps> = ({ activeSide, onSelectSide }) => {
    const options: { id: EarSide; label: string }[] = [
        { id: 'left', label: 'Izquierda' },
        { id: 'both', label: 'Ambas' },
        { id: 'right', label: 'Derecha' },
    ];

    return (
        <div className="w-full p-2 bg-[rgba(24,21,22,0.8)] border border-[#D5B488] rounded-xl flex justify-center items-center gap-2">
            {options.map(({ id, label }) => (
                <button
                    key={id}
                    onClick={() => onSelectSide(id)}
                    className={`flex-1 text-center py-2 px-3 text-sm font-bold rounded-lg transition-colors duration-200
                        ${activeSide === id 
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

export default EarSelector;
