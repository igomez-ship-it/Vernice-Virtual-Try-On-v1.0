import React, { useMemo } from 'react';
import { DetectionMode } from '../types';
import { jewelryCatalog } from '../constants';

interface JewelryCarouselProps {
    isVisible: boolean;
    mode: DetectionMode;
    activeJewelId: string | null;
    onSelectJewel: (id: string) => void;
    handedness: 'left' | 'right';
    onClose: () => void;
}

const JewelryCarousel: React.FC<JewelryCarouselProps> = ({ isVisible, mode, activeJewelId, onSelectJewel, handedness, onClose }) => {
    const jewelsForMode = useMemo(() => {
        return Object.entries(jewelryCatalog).filter(([, jewel]) => jewel.type === mode);
    }, [mode]);
    
    const positionClasses = handedness === 'right' ? 'right-0' : 'left-0';

    return (
        <div className={`relative bg-[rgba(24,21,22,0.8)] border border-[#D5B488] rounded-xl p-4 pt-8 absolute top-[calc(100%_+_10px)] max-h-[230px] w-28 transition-all duration-300 ease-in-out ${positionClasses} ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none -top-10'}`}>
            <button
                onClick={onClose}
                className="absolute top-1 right-1.5 text-[#D5B488] hover:text-white transition-colors text-2xl font-bold w-6 h-6 flex items-center justify-center z-10"
                aria-label="Cerrar selección de joyas"
            >
                &times;
            </button>
            <div className="overflow-y-auto flex flex-col items-center gap-4 -mr-4 pr-4 h-full">
                {jewelsForMode.map(([id, jewel]) => (
                    <button
                        key={id}
                        onClick={() => onSelectJewel(id)}
                        className={`bg-transparent border-2 rounded-xl w-16 h-16 flex-shrink-0 cursor-pointer bg-cover bg-center transition-colors ${activeJewelId === id ? 'border-white' : 'border-[#D5B488] hover:border-white/70'}`}
                        style={{ backgroundImage: `url(${jewel.imageUrl})` }}
                        title={`Select Jewel ${id}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default JewelryCarousel;
