
import React from 'react';

interface PageContainerProps {
    children: React.ReactNode;
    isVisible: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, isVisible }) => {
    return (
        <div className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center p-5 box-border transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 invisible'}`}>
            {children}
        </div>
    );
};

export default PageContainer;
