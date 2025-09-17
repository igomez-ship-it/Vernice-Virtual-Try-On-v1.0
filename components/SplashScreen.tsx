
import React from 'react';
import PageContainer from './PageContainer';

interface SplashScreenProps {
    onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
    return (
        <PageContainer isVisible={true}>
            <img className="max-w-[250px] mb-8" src="https://i.ibb.co/tMbs4vmc/LOGOletrabl.png" alt="Logo de Vernice" />
            <h1 className="text-4xl mb-2">Bienvenida</h1>
            <p className="text-lg max-w-sm mb-10">Pruébate nuestras joyas virtualmente.</p>
            <button
                onClick={onStart}
                className="bg-[#D5B488] text-[#181516] border-none py-5 px-10 text-lg font-bold uppercase cursor-pointer rounded-lg hover:bg-opacity-90 transition-colors"
            >
                Empezar
            </button>
        </PageContainer>
    );
};

export default SplashScreen;
