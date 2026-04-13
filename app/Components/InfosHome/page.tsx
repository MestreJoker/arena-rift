'use client';

import { useEffect, useState } from 'react';

export default function InfosHome() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const infoItems = [
        { number: "2.4K+", label: "Jogadores ativos" },
        { number: "48", label: "Campeonatos realizados" },
        { number: "2.4K+", label: "Jogadores ativos" }
    ];

    return (
        <section 
            className={`
                w-full flex flex-col sm:flex-row justify-center items-center mt-14
                gap-4 sm:gap-6 md:gap-8 lg:gap-10
                px-4 sm:px-6 md:px-8
                transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
        >
            {infoItems.map((item, index) => (
                <div 
                    key={index}
                    className={`
                        flex flex-col items-center
                        w-full sm:w-auto min-w-[120px] sm:min-w-[140px] md:min-w-[160px]
                        px-4 sm:px-5 md:px-6
                        py-3 sm:py-4
                        border-b-2 sm:border-b-0 sm:border-r-2
                        border-gray-400/30
                        last:border-b-0 last:sm:border-r-0
                        hover:border-gray-400/60 transition-colors duration-300
                    `}
                >
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 mb-1 sm:mb-2 text-center">
                        {item.number}
                    </h3>
                    <p className="text-white text-xs sm:text-sm md:text-base text-center">
                        {item.label}
                    </p>
                </div>
            ))}
        </section>
    );
}