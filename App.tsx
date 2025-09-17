
import React, { useState, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import CategorySelector from './components/CategorySelector';
import ArView from './components/ArView';
import { DetectionMode } from './types';

type Page = 'splash' | 'category' | 'ar';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('splash');
    const [detectionMode, setDetectionMode] = useState<DetectionMode>('rings');

    const handleStart = useCallback(() => {
        setPage('category');
    }, []);

    const handleSelectCategory = useCallback((mode: DetectionMode) => {
        setDetectionMode(mode);
        setPage('ar');
    }, []);

    const handleBackToCategory = useCallback(() => {
        setPage('category');
    }, []);

    const renderPage = () => {
        switch (page) {
            case 'splash':
                return <SplashScreen onStart={handleStart} />;
            case 'category':
                return <CategorySelector onSelectCategory={handleSelectCategory} />;
            case 'ar':
                return <ArView mode={detectionMode} onBack={handleBackToCategory} />;
            default:
                return <SplashScreen onStart={handleStart} />;
        }
    };

    return (
        <div className="w-screen h-screen bg-[#181516] text-white overflow-hidden">
            {renderPage()}
        </div>
    );
};

export default App;
