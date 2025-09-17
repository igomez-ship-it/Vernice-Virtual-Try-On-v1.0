
import React from 'react';
import PageContainer from './PageContainer';
import { DetectionMode } from '../types';

interface CategorySelectorProps {
    onSelectCategory: (mode: DetectionMode) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectCategory }) => {
    return (
        <PageContainer isVisible={true}>
            <img className="max-w-[250px] mb-8" src="https://i.ibb.co/tMbs4vmc/LOGOletrabl.png" alt="Logo de Vernice" />
            <h1 className="text-4xl mb-8">Elige una categoría</h1>
            <div className="flex flex-col gap-5 w-full max-w-sm">
                <button
                    onClick={() => onSelectCategory('rings')}
                    className="bg-[#D5B488] text-[#181516] border-none py-5 px-10 text-lg font-bold uppercase cursor-pointer rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Anillos
                </button>
                <button
                    onClick={() => onSelectCategory('necklaces')}
                    className="bg-[#D5B488] text-[#181516] border-none py-5 px-10 text-lg font-bold uppercase cursor-pointer rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Collares
                </button>
                <button
                    onClick={() => onSelectCategory('earrings')}
                    className="bg-[#D5B488] text-[#181516] border-none py-5 px-10 text-lg font-bold uppercase cursor-pointer rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Aros
                </button>
            </div>
        </PageContainer>
    );
};

export default CategorySelector;
