
import React from 'react';

interface JewelAdjusterProps {
    scale?: number;
    onScaleChange?: (scale: number) => void;
    offsetX?: number;
    onOffsetXChange?: (offsetX: number) => void;
    offsetY?: number;
    onOffsetYChange?: (offsetY: number) => void;
}

const JewelAdjuster: React.FC<JewelAdjusterProps> = ({ 
    scale, onScaleChange, 
    offsetX, onOffsetXChange,
    offsetY, onOffsetYChange 
}) => {
    const hasControls = [onScaleChange, onOffsetXChange, onOffsetYChange].some(val => val !== undefined);

    if (!hasControls) return null;

    return (
        <div className="w-full p-4 bg-[rgba(24,21,22,0.8)] border border-[#D5B488] rounded-xl pointer-events-auto flex flex-col gap-4">
            {onScaleChange && typeof scale === 'number' && (
                 <div className="flex flex-col gap-2 text-sm text-white">
                    <label htmlFor="scale-slider" className="font-bold text-[#D5B488]">Tamaño</label>
                    <input
                        id="scale-slider"
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={scale}
                        onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-[#D5B488]/30 rounded-lg appearance-none cursor-pointer range-thumb"
                        aria-label="Ajustar tamaño"
                    />
                </div>
            )}
            {onOffsetXChange && typeof offsetX === 'number' && (
                <div className="flex flex-col gap-2 text-sm text-white">
                    <label htmlFor="separation-slider" className="font-bold text-[#D5B488]">Separación Horizontal</label>
                    <input
                        id="separation-slider"
                        type="range"
                        min="-20"
                        max="50"
                        step="1"
                        value={offsetX}
                        onChange={(e) => onOffsetXChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-[#D5B488]/30 rounded-lg appearance-none cursor-pointer range-thumb"
                        aria-label="Ajustar separación horizontal"
                    />
                </div>
            )}
            {onOffsetYChange && typeof offsetY === 'number' && (
                <div className="flex flex-col gap-2 text-sm text-white">
                    <label htmlFor="offset-y-slider" className="font-bold text-[#D5B488]">Posición Vertical</label>
                    <input
                        id="offset-y-slider"
                        type="range"
                        min={-50}
                        max={300}
                        step="1"
                        value={offsetY}
                        onChange={(e) => onOffsetYChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-[#D5B488]/30 rounded-lg appearance-none cursor-pointer range-thumb"
                        aria-label="Ajustar posición vertical"
                    />
                </div>
            )}
            <style>
                {`
                    .range-thumb::-webkit-slider-thumb {
                        -webkit-appearance: none; appearance: none;
                        width: 20px; height: 20px;
                        background: #D5B488; cursor: pointer;
                        border-radius: 50%; border: 2px solid #181516;
                        margin-top: -8px;
                    }
                    .range-thumb::-moz-range-thumb {
                        width: 16px; height: 16px;
                        background: #D5B488; cursor: pointer;
                        border-radius: 50%; border: 2px solid #181516;
                    }
                `}
            </style>
        </div>
    );
};

export default JewelAdjuster;