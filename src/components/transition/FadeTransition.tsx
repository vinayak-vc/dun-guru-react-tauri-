import React, { useEffect, useState } from 'react';

const FadeTransition: React.FC<{ screenKey: string; children: React.ReactNode; className?: string }> = ({ screenKey, children, className }) => {
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        setOpacity(0);
        requestAnimationFrame(() => {
            setOpacity(1);
        });
    }, [screenKey]);

    return (
        <div
            className={`transition-opacity duration-200 ease-out ${className}`}
            style={{ opacity }}
        >
            {children}
        </div>
    );
};

export default FadeTransition;
