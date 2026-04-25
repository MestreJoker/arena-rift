'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import CampeonatoCard from "../CampeonatoCard/page"

export default function CarrosselCampeonatos() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);

    const campeonatos = [
        { id: "0", titulo: "1v1 Desafio Supremo", tipo: "1v1", status: "Aberto", jogadores: "12/16", premio: "R$100", imagem: "/images/imageHome5.jpg" },
        { id: "1", titulo: "5v5 Arena Elite", tipo: "5v5", status: "Em andamento", jogadores: "8/10", premio: "R$300", imagem: "/images/imageHome5.jpg" },
        { id: "2", titulo: "1v1 Rápido", tipo: "1v1", status: "Aberto", jogadores: "6/16", premio: "R$50", imagem: "/images/imageHome5.jpg" },
        { id: "3", titulo: "Copa Wild Rift #1", tipo: "5v5", status: "Aberto", jogadores: "4/16", premio: "R$500", imagem: "/images/imageHome5.jpg" },
        { id: "4", titulo: "Duelo de Titãs", tipo: "1v1", status: "Em andamento", jogadores: "14/16", premio: "R$200", imagem: "/images/imageHome5.jpg" },
        { id: "5", titulo: "Liga Semanal", tipo: "5v5", status: "Aberto", jogadores: "2/8", premio: "R$150", imagem: "/images/imageHome5.jpg" },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else {
                setItemsToShow(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Avança apenas se não estiver no último conjunto possível
    const nextSlide = () => {
        if (currentIndex < campeonatos.length - itemsToShow) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    // Recua apenas se não estiver no primeiro item
    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <section className="w-full py-16 px-4 sm:px-12 max-w-[1400px] mx-auto relative">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-[#cd6931] text-[10px] font-black tracking-[0.4em] uppercase">Competitivo</h2>
                    <h3 className="text-white text-3xl font-black italic uppercase">Destaques</h3>
                </div>
                <Link href="/campeonatos" className="text-gray-500 hover:text-[#cd6931] transition-colors font-bold text-[10px] tracking-widest uppercase border-b border-white/5 pb-1">
                    Ver Todos →
                </Link>
            </div>

            <div className="relative px-2">
                <div className="overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ 
                            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` 
                        }}
                    >
                        {campeonatos.map((camp) => (
                            <div key={camp.id} className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-3">
                                <CampeonatoCard {...camp} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seta Esquerda - Só aparece se não estiver no index 0 */}
                {currentIndex > 0 && (
                    <button 
                        onClick={prevSlide}
                        className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-[#cd6931] hover:border-[#cd6931]/50 z-30 transition-all flex items-center justify-center shadow-xl hover:cursor-pointer"
                    >
                        &#10094;
                    </button>
                )}

                {/* Seta Direita - Só aparece se ainda houver itens escondidos à direita */}
                {currentIndex < campeonatos.length - itemsToShow && (
                    <button 
                        onClick={nextSlide}
                        className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-[#cd6931] hover:border-[#cd6931]/50 z-30 transition-all flex items-center justify-center shadow-xl hover:cursor-pointer"
                    >
                        &#10095;
                    </button>
                )}
            </div>
        </section>
    );
}