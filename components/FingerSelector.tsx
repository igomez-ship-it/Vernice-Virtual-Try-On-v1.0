import React from 'react';
import { FINGER_NAMES } from '../constants';

interface FingerSelectorProps {
    activeFinger: string;
    onSelectFinger: (finger: string) => void;
    handedness: 'left' | 'right';
}

const FINGER_STYLES: { [key: string]: React.CSSProperties } = {
    thumb: {
        top: '82px',
        left: '45px',
        width: '15px',
        height: '15px',
    },
    index: {
        top: '38px',
        left: '70px',
        width: '15px',
        height: '15px',
    },
    middle: {
        top: '37px',
        left: '95px',
        width: '15px',
        height: '15px',
    },
    ring: {
        top: '41px',
        left: '115px',
        width: '15px',
        height: '15px',
    },
    pinky: {
        top: '56px',
        left: '135px',
        width: '15px',
        height: '15px',
    },
};

const FingerSelector: React.FC<FingerSelectorProps> = ({ activeFinger, onSelectFinger, handedness }) => {
    return (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-52 h-40 pointer-events-auto">
            <div
                id="hand-visual-selector"
                className={`w-full h-full bg-contain bg-no-repeat bg-center relative transition-transform duration-400 ease-in-out ${handedness === 'right' ? 'scale-x-[-1]' : ''}`}
                style={{ backgroundImage: "url('https://i.ibb.co/hFhNxZGD/Untitled-1-Photoroom.png')" }}
            >
                {FINGER_NAMES.map(finger => (
                    <div
                        key={finger}
                        onClick={() => onSelectFinger(finger)}
                        className={`absolute rounded-[50%] cursor-pointer border-2 box-border transition-all duration-200 ease-in-out
                            ${activeFinger === finger 
                                ? 'border-[#D5B488] bg-[rgba(213,180,136,0.4)] shadow-[0_0_10px_#D5B488]' 
                                : 'border-white/40 hover:border-[#D5B488] hover:bg-[rgba(213,180,136,0.2)]'
                            }`
                        }
                        style={FINGER_STYLES[finger]}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default FingerSelector;
