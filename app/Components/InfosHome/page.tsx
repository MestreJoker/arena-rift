'use client';

import { useEffect, useState } from 'react';

export default function InfosHome() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Pequeno delay para garantir que a animação seja visível
        setTimeout(() => {
            setIsVisible(true);
        }, 100);
    }, []);

    return (
        <section 
            className={`w-full flex justify-center [&>div>h3]:text-orange-500 gap-x-10 sm:gap-x-0
            [&_>div>h3]:text-4xl [&_>div>h3]:font-bold sm:[&_>div]:border-r-2 [&_>div:last-child]:border-r-0
            [&>div]:border-gray-400 gap-y-5 sm:[&_>div]:border-b-0 px-6 sm:px-0
            sm:[&_>div]:px-6 mt-15 [&>div>p]:text-white [&>div>p]:text-[0.8rem] [&_>div]:w-fit items-center sm:items-baseline flex-wrap
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="flex flex-col items-center">
                <h3>2.4K+</h3>
                <p className="text-center">Jogadores ativos</p>
            </div>

            <div className="flex flex-col items-center">
                <h3>48</h3>
                <p className="text-center">Campeonatos realizados</p>
            </div>

            <div className="flex flex-col items-center">
                <h3>2.4K+</h3>
                <p className="text-center">Jogadores ativos</p>
            </div>
        </section>
    );
}